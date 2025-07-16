import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
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

  darkMode = this.themeService.darkMode;
  loading = this.ui.loading;
  error = this.ui.error;

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

}
