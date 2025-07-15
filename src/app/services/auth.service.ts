import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly STORAGE_KEY = 'auth_user';
  public showMarketCap = false; // Added to determine if the input is provided

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  // Registration function
  register(user: any): boolean {
    try {
      const existingUser = this.safeGetItem(user.email); // Safely retrieve the data
      if (existingUser) return false;

      this.safeSetItem(user.email, JSON.stringify(user)); // Safely store the data
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  // Login function
  login(email: string, password: string): boolean {
    try {
      const stored = this.safeGetItem(email); // Safely retrieve the data
      if (!stored) return false;

      const user = JSON.parse(stored);
      if (user.password === password) {
        this.safeSetItem(this.STORAGE_KEY, JSON.stringify(user)); // Safely store the data
        this.showMarketCap = true; // Successful login
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  // Logout
  logout(): void {
    try {
      this.safeRemoveItem(this.STORAGE_KEY); // Securely delete data
      this.showMarketCap = false; // Hide if the user is logged out
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // User data
  getUser(): any {
    try {
      const user = this.safeGetItem(this.STORAGE_KEY); // Safely retrieve data
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Logout status
  isLoggedIn(): boolean {
    try {
      const user = this.safeGetItem(this.STORAGE_KEY); // Safely retrieve data
      if (!user) return false;

      JSON.parse(user); // If an error occurred, we forgot the calculations
      return true;
    } catch (error) {
      console.warn('Corrupted auth_user in storage');
      this.logout(); // Remove corrupted data
      return false;
    }
  }

  // Search by user's email
  getUserByEmail(email: string): any {
    const data = this.safeGetItem(email); // Safely retrieve data
    return data ? JSON.parse(data) : null;
  }

  // Safe functions for LocalStorage

  // Safe data retrieval
  private safeGetItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error(`Error getting item ${key} from localStorage`, error);
      }
    }
    return null;
  }

  // Safe data addition
  private safeSetItem(key: string, value: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error(`Error setting item ${key} in localStorage`, error);
      }
    }
  }

  // Safe data deletion
  private safeRemoveItem(key: string): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error(`Error removing item ${key} from localStorage`, error);
      }
    }
  }

}