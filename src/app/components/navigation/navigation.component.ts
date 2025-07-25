import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { MovieSearchComponent } from "../movie-search/movie-search.component";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    MovieSearchComponent
],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit{

  public auth = inject(AuthService);
  private themeService = inject(ThemeToggleService);
  private ui = inject(UiStateService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  darkMode = computed(() => this.themeService.darkMode());
  loading = computed(() => this.ui.loading());
  error = computed(() => this.ui.error());

  navbarOpen = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  closeNavbar() {
    this.navbarOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.closeNavbar();
        }
      });
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }



  // Signal to track the current URL
  currentUrl = signal(this.router.url);

  constructor() {
    // Listen to route changes
    this.router.events.subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  isHomePage = computed(() => this.currentUrl().startsWith('/home') || this.currentUrl() === '/');

}
