/**
 * Auth Utility Functions
 * Static methods for checking authentication status without dependency injection
 * This prevents circular dependencies while providing global access to auth checks
 */
export class AuthUtils {
  
  /**
   * Check if user is currently logged in
   * @returns boolean - true if user is authenticated, false otherwise
   */
  static isUserLoggedIn(): boolean {
    try {
      const userData = localStorage.getItem('userData');
      if (!userData) {
        return false;
      }
      
      const user = JSON.parse(userData);
      
      // Check if user object has required properties
      if (!user._token || !user._expiration) {
        return false;
      }
      
      // Check if token is expired
      const expirationDate = new Date(user._expiration);
      const now = new Date();
      
      if (expirationDate <= now) {
        // Token is expired, clean up localStorage
        localStorage.removeItem('userData');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking authentication status:', error);
      // Clean up corrupted data
      localStorage.removeItem('userData');
      return false;
    }
  }
  
  /**
   * Get current user data if logged in
   * @returns User object or null
   */
  static getCurrentUser(): any | null {
    try {
      if (!this.isUserLoggedIn()) {
        return null;
      }
      
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }
  
  /**
   * Get current user token if logged in
   * @returns string token or null
   */
  static getUserToken(): string | null {
    try {
      const user = this.getCurrentUser();
      return user?._token || null;
    } catch (error) {
      console.error('Error getting user token:', error);
      return null;
    }
  }
  
  /**
   * Get current user role if logged in
   * @returns string role or null
   */
  static getUserRole(): string | null {
    try {
      const user = this.getCurrentUser();
      return user?.role || null;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }
  
  /**
   * Check if user has specific role
   * @param role - Role to check
   * @returns boolean
   */
  static hasRole(role: string): boolean {
    const userRole = this.getUserRole();
    return userRole === role;
  }
  
  /**
   * Check if user is admin
   * @returns boolean
   */
  static isAdmin(): boolean {
    return this.hasRole('Admin');
  }
  
  /**
   * Check if user is client
   * @returns boolean
   */
  static isClient(): boolean {
    return this.hasRole('Patient') || this.hasRole('Client');
  }
  
  /**
   * Check if user is pharmacy
   * @returns boolean
   */
  static isPharmacy(): boolean {
    return this.hasRole('Pharmacy');
  }
}
