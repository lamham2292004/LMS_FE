import { API_CONFIG, STORAGE_KEYS } from "./config";

// API Configuration
const API_BASE_URL = API_CONFIG.baseUrl;

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  result?: T;  // Spring Boot backend format
  user?: T;
  token?: string;
  message?: string;
  code?: number;  // Spring Boot backend format
  status?: number;
}

import {
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "@/features/auth/types";

// Re-export types for backward compatibility
export type { LoginRequest, LoginResponse, UserProfile };

// HTTP Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        : null;
    
    // Debug log
    if (typeof window !== "undefined") {
      console.log("🔧 ApiClient constructor - Token loaded from localStorage:", 
        this.token ? `YES (${this.token.substring(0, 20)}...)` : "NO");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    console.log("API Client - Login credentials:", credentials);

    const response = await this.request<LoginResponse>("/v1/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    console.log("API Client - Raw response:", response);

    // Handle both formats: response.data.token OR response.token
    if (response.data?.token || response.token) {
      const token = response.data?.token || response.token;
      this.setToken(token!);
      console.log("API Client - Token set successfully:", token);
    } else {
      console.log("API Client - No token in response");
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      await this.request("/v1/logout", { method: "POST" });
    } finally {
      this.clearToken();
    }

    return { message: "Đăng xuất thành công" };
  }

  async getProfile(userType?: "student" | "lecturer"): Promise<ApiResponse<UserProfile>> {
    // First get token claims from /v1/me to get birth_date and other fields
    const meResponse = await this.request<any>("/v1/me");
    console.log("API Client - /v1/me response:", meResponse);
    
    // Then get detailed profile from user-specific endpoint
    const endpoint = userType === "student"
      ? "/v1/student/profile"
      : userType === "lecturer"
      ? "/v1/lecturer/profile"
      : "/v1/me";
    
    const profileResponse = await this.request<UserProfile>(endpoint);
    console.log("API Client - Profile endpoint response:", profileResponse);
    
    // Handle both formats: response.data OR response.result (Spring Boot backend)
    const profileData = profileResponse.data || profileResponse.result || (profileResponse as any);
    const meData = meResponse.data || meResponse.result || (meResponse as any);
    
    // Merge data: profile API data + token claims
    if (profileData && typeof profileData === 'object' && meData && typeof meData === 'object') {
      const mergedData = {
        ...profileData,
        // Add missing fields from token (from /v1/me)
        birth_date: profileData.birth_date || meData.birth_date,
        gender: profileData.gender || meData.gender,
        address: profileData.address || meData.address,
      };
      console.log("API Client - Merged profile data:", mergedData);
      // Return in format that AuthContext expects
      return { data: mergedData, result: mergedData } as any;
    }
    
    return profileResponse;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>("/v1/refresh", {
      method: "POST",
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // Token Management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      // Also set token in cookie for middleware access
      document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      // Also clear cookie
      document.cookie = "token=; path=/; max-age=0";
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
