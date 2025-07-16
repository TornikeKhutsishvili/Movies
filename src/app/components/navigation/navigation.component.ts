import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';
import { ThemeToggleService } from '../../services/theme-toggle.service';
import { MovieSearchComponent } from "../movie-search/movie-search.component";

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

  private themeService = inject(ThemeToggleService);
  private ui = inject(UiStateService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  darkMode = computed(() => this.themeService.darkMode());
  loading = computed(() => this.ui.loading());
  error = computed(() => this.ui.error());

  navbarOpen = signal(false);

  toggleNavbar() {
    this.navbarOpen.set(!this.navbarOpen);
  }

  closeNavbar() {
    this.navbarOpen.set(false);
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

}