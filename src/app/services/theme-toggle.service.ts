import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeToggleService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private _darkMode = signal<boolean>(this.isPlatformBrowser() && localStorage.getItem('theme') === 'dark');

  darkMode = this._darkMode;

  private isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  toggleDarkMode(): void {
    if (this.isPlatformBrowser()) {
      this._darkMode.update(val => {
        const newVal = !val;
        document.body.classList.toggle('dark-mode', newVal);
        localStorage.setItem('theme', newVal ? 'dark' : 'light');
        return newVal;
      });
    }
  }

}