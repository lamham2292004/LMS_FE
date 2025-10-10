"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiClient, UserProfile, LoginRequest, ApiResponse } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  userRole: "student" | "lecturer" | "admin" | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLecturer: boolean;
  isStudent: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  login: (credentials: LoginRequest) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Computed values - Logic phân quyền mới
  const userRole = user
    ? user.user_type === "student"
      ? "student"
      : Boolean(user.account?.is_admin)
      ? "admin"
      : "lecturer"
    : null;
  const isAuthenticated = !!user;
  const isAdmin = userRole === "admin";
  const isLecturer = userRole === "lecturer";
  const isStudent = userRole === "student";

  // Helper function to decode JWT token
  const decodeJWT = (token: string): any => {
    try {
      if (!token || typeof token !== 'string') {
        console.error("Invalid token: token is null or not a string");
        return null;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error(`Invalid token format: expected 3 parts, got ${parts.length}`);
        return null;
      }
      
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          // Try to get user type from token or localStorage
          const token = apiClient.getToken();
          let userType: "student" | "lecturer" | undefined;
          
          // Decode token to get user_type
          if (token) {
            const decoded = decodeJWT(token);
            console.log("AuthContext - Decoded token:", decoded);
            if (decoded && decoded.user_type) {
              userType = decoded.user_type;
              console.log("AuthContext - User type from token:", userType);
            }
          }
          
          // Fallback to localStorage if token doesn't have user_type
          if (!userType && typeof window !== "undefined") {
            const storedUserType = localStorage.getItem("user_type");
            if (storedUserType === "student" || storedUserType === "lecturer") {
              userType = storedUserType;
              console.log("AuthContext - User type from localStorage:", userType);
            }
          }
          
          const response = await apiClient.getProfile(userType);
          console.log("AuthContext - Profile response:", response);
          console.log("AuthContext - User type used:", userType);
          console.log("AuthContext - Endpoint called:", userType ? `/v1/${userType}/profile` : '/v1/me');
          
          if (response.data) {
            console.log("AuthContext - Profile data keys:", Object.keys(response.data));
            console.log("AuthContext - Birth date from API:", response.data.birth_date);
            
            // Always try to enrich user data with token claims
            let userData = response.data;
            if (token) {
              const decoded = decodeJWT(token);
              console.log("AuthContext - Decoded token claims:", decoded);
              
              // Merge missing fields from token
              if (decoded) {
                if (!userData.birth_date && decoded.birth_date) {
                  console.log("AuthContext - Adding birth_date from token:", decoded.birth_date);
                  userData = { ...userData, birth_date: decoded.birth_date };
                }
                if (!userData.gender && decoded.gender) {
                  console.log("AuthContext - Adding gender from token:", decoded.gender);
                  userData = { ...userData, gender: decoded.gender };
                }
                if (!userData.address && decoded.address) {
                  console.log("AuthContext - Adding address from token:", decoded.address);
                  userData = { ...userData, address: decoded.address };
                }
              }
            }
            
            console.log("AuthContext - Final user data:", userData);
            setUser(userData);
            // Store user type for future use
            if (typeof window !== "undefined") {
              localStorage.setItem("user_type", userData.user_type);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        apiClient.clearToken();
        // Clear stored user type on error
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_type");
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<ApiResponse> => {
    try {
      setIsLoggingIn(true);
      const response = await apiClient.login(credentials);

      console.log("AuthContext - Full response:", response);
      console.log("AuthContext - Response data:", response.data);
      console.log("AuthContext - Response keys:", Object.keys(response));
      if (response.data) {
        console.log("AuthContext - Data keys:", Object.keys(response.data));
      }

      // Handle both formats: response.data OR response.user
      const userData = response.data || response.user;
      if (userData) {
        setUser(userData);
        // Store user type in localStorage for future use
        if (typeof window !== "undefined") {
          localStorage.setItem("user_type", userData.user_type);
        }
        console.log("AuthContext - User set successfully:", userData);
      } else {
        console.log("AuthContext - No user data in response");
        throw new Error("Không nhận được thông tin người dùng từ server");
      }

      return response;
    } catch (error: any) {
      console.error("AuthContext - Login error:", error);
      
      // Enhanced error handling
      let errorMessage = "Đăng nhập thất bại. Vui lòng thử lại.";
      
      if (error.message) {
        if (error.message.includes("401") || error.message.includes("Unauthorized")) {
          errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác";
        } else if (error.message.includes("403") || error.message.includes("Forbidden")) {
          errorMessage = "Tài khoản của bạn không có quyền truy cập";
        } else if (error.message.includes("500") || error.message.includes("Internal Server Error")) {
          errorMessage = "Lỗi server. Vui lòng thử lại sau";
        } else if (error.message.includes("Network") || error.message.includes("fetch")) {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng";
        } else {
          errorMessage = error.message;
        }
      }
      
      const enhancedError = new Error(errorMessage);
      enhancedError.cause = error;
      throw enhancedError;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      apiClient.clearToken();
      // Clear user type from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user_type");
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const token = apiClient.getToken();
      let userType: "student" | "lecturer" | undefined;
      
      // Try to get user_type from token first
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded && decoded.user_type) {
          userType = decoded.user_type;
          console.log("AuthContext - Refresh: User type from token:", userType);
        }
      }
      
      // Fallback to current user or localStorage
      if (!userType && user?.user_type) {
        userType = user.user_type;
      } else if (!userType && typeof window !== "undefined") {
        const storedUserType = localStorage.getItem("user_type");
        if (storedUserType === "student" || storedUserType === "lecturer") {
          userType = storedUserType;
        }
      }
      
      const response = await apiClient.getProfile(userType);
      console.log("AuthContext - Refresh profile response:", response);
      console.log("AuthContext - Refresh user type:", userType);
      console.log("AuthContext - Refresh endpoint:", userType ? `/v1/${userType}/profile` : '/v1/me');
      
      if (response.data) {
        console.log("AuthContext - Refresh profile data keys:", Object.keys(response.data));
        console.log("AuthContext - Refresh birth date from API:", response.data.birth_date);
        
        // Always try to enrich user data with token claims
        let userData = response.data;
        if (token) {
          const decoded = decodeJWT(token);
          console.log("AuthContext - Refresh decoded token claims:", decoded);
          
          // Merge missing fields from token
          if (decoded) {
            if (!userData.birth_date && decoded.birth_date) {
              console.log("AuthContext - Refresh adding birth_date from token:", decoded.birth_date);
              userData = { ...userData, birth_date: decoded.birth_date };
            }
            if (!userData.gender && decoded.gender) {
              userData = { ...userData, gender: decoded.gender };
            }
            if (!userData.address && decoded.address) {
              userData = { ...userData, address: decoded.address };
            }
          }
        }
        
        console.log("AuthContext - Refresh final user data:", userData);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    userRole,
    isAuthenticated,
    isAdmin,
    isLecturer,
    isStudent,
    isLoading,
    isLoggingIn,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  
};
