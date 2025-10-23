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
      console.log("🔍 AuthContext - checkAuth START");
      console.log("🔍 apiClient.isAuthenticated():", apiClient.isAuthenticated());
      console.log("🔍 localStorage auth_token:", typeof window !== 'undefined' ? localStorage.getItem('auth_token') : 'SSR');
      
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
          console.log("AuthContext - Response keys:", Object.keys(response || {}));
          console.log("AuthContext - response.data exists?", !!response?.data);
          console.log("AuthContext - response.result exists?", !!response?.result);
          console.log("AuthContext - User type used:", userType);
          console.log("AuthContext - Endpoint called:", userType ? `/v1/${userType}/profile` : '/v1/me');
          
          // Handle both formats: response.data (old) OR response.result (Spring Boot backend)
          const profileData = response.data || response.result || (response as any);
          
          if (profileData && typeof profileData === 'object' && 'email' in profileData) {
            console.log("AuthContext - Profile data keys:", Object.keys(profileData));
            console.log("AuthContext - Birth date from API:", profileData.birth_date);
            
            // Always try to enrich user data with token claims
            let userData = profileData;
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
            console.log("✅ AuthContext - User SET successfully!");
            // Store user type for future use
            if (typeof window !== "undefined") {
              localStorage.setItem("user_type", userData.user_type);
            }
          } else {
            console.error("❌ AuthContext - Profile data not found in response!");
            console.error("❌ response.data:", response?.data);
            console.error("❌ response.result:", response?.result);
            console.error("❌ Full response:", JSON.stringify(response, null, 2));
          }
        } else {
          console.log("🔍 AuthContext - apiClient NOT authenticated (no token)");
        }
      } catch (error) {
        console.error("❌ AuthContext - Failed to check authentication:", error);
        console.error("❌ Error details:", JSON.stringify(error, null, 2));
        apiClient.clearToken();
        // Clear stored user type on error
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_type");
        }
      } finally {
        console.log("✅ AuthContext - checkAuth COMPLETE, isLoading set to false");
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
      console.log("AuthContext - Response result:", response.result);
      console.log("AuthContext - Response keys:", Object.keys(response));

      // Handle multiple formats: response.data OR response.result (Spring Boot) OR response.user
      const userData = response.data || response.result || response.user;
      if (userData) {
        setUser(userData);
        // Store user type in localStorage for future use
        if (typeof window !== "undefined") {
          localStorage.setItem("user_type", userData.user_type);
        }
        console.log("AuthContext - User set successfully:", userData);
      } else {
        console.log("AuthContext - No user data in response");
      }

      return response;
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      throw error;
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
