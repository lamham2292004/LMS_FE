// Token Manager - Handle JWT token expiration
import { STORAGE_KEYS } from './config';

export interface DecodedToken {
  exp: number;
  iat: number;
  sub?: number;  // JWT standard - subject (user ID)
  userId?: number;
  user_id?: number;  // Backend có thể dùng snake_case
  email: string;
  userType?: string;
  user_type?: string;  // Backend có thể dùng snake_case
  [key: string]: any;
}

export class TokenManager {
  private static instance: TokenManager;

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Decode JWT token without verification
   */
  decodeToken(token: string): DecodedToken | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token format');
        return null;
      }

      const payload = parts[1];
      const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp < currentTime;

    if (isExpired) {
      console.warn('Token đã hết hạn:', {
        expiredAt: new Date(decoded.exp * 1000).toISOString(),
        currentTime: new Date(currentTime * 1000).toISOString(),
      });
    }

    return isExpired;
  }

  /**
   * Check if token will expire soon (within minutes)
   */
  willExpireSoon(token: string, withinMinutes: number = 5): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;
    const minutesUntilExpiry = timeUntilExpiry / 60;

    return minutesUntilExpiry <= withinMinutes;
  }

  /**
   * Get token from localStorage
   */
  getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  /**
   * Check if current token is valid
   */
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  /**
   * Clear expired token
   */
  clearExpiredToken(): void {
    const token = this.getToken();
    if (token && this.isTokenExpired(token)) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        console.log('🗑️ Cleared expired token');
      }
    }
  }

  /**
   * Get token info
   */
  getTokenInfo(): {
    isValid: boolean;
    isExpired: boolean;
    expiresAt: string | null;
    timeRemaining: string | null;
  } {
    const token = this.getToken();
    
    if (!token) {
      return {
        isValid: false,
        isExpired: true,
        expiresAt: null,
        timeRemaining: null,
      };
    }

    const decoded = this.decodeToken(token);
    if (!decoded) {
      return {
        isValid: false,
        isExpired: true,
        expiresAt: null,
        timeRemaining: null,
      };
    }

    const isExpired = this.isTokenExpired(token);
    const expiresAt = new Date(decoded.exp * 1000).toISOString();
    
    let timeRemaining = null;
    if (!isExpired) {
      const currentTime = Math.floor(Date.now() / 1000);
      const secondsRemaining = decoded.exp - currentTime;
      const minutes = Math.floor(secondsRemaining / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        timeRemaining = `${days} ngày`;
      } else if (hours > 0) {
        timeRemaining = `${hours} giờ`;
      } else {
        timeRemaining = `${minutes} phút`;
      }
    }

    return {
      isValid: !isExpired,
      isExpired,
      expiresAt,
      timeRemaining,
    };
  }

  /**
   * Format token expiry time
   */
  getExpiryTime(token: string): string | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;

    return new Date(decoded.exp * 1000).toLocaleString('vi-VN');
  }

  /**
   * Get decoded token from localStorage
   */
  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;
    return this.decodeToken(token);
  }
}

// Export singleton instance
export const tokenManager = TokenManager.getInstance();

// Export utility functions
export const isTokenExpired = (token: string) => tokenManager.isTokenExpired(token);
export const isTokenValid = () => tokenManager.isTokenValid();
export const clearExpiredToken = () => tokenManager.clearExpiredToken();
export const getTokenInfo = () => tokenManager.getTokenInfo();
export const getDecodedToken = () => tokenManager.getDecodedToken();

