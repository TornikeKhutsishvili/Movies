import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../../models/movieAPI.model';
import { FavouritesService } from '../../services/favourites.service';
import { filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PulseAnimationComponent } from "../pulse-animation/pulse-animation.component";
import { MovieDurationComponent } from "../movie-duration/movie-duration.component";

declare const bootstrap: any;

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PulseAnimationComponent,
    MovieDurationComponent
],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit, OnDestroy {
  private favouriteService = inject(FavouritesService);
  private movieSearchService = inject(MovieSearchService);
  readonly groupedFavourites = signal<Record<string, Movie[]>>({});
  activeCardId: string | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {}

  // Search query signal
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // Get filtered results from MovieSearchService
  readonly filteredServiceResults = toSignal(this.movieSearchService.filteredMovies$, {
    initialValue: []
  });

  // Final list shown in the template
  readonly filteredFavourites = computed(() => {
    const query = this.searchQuery().trim();
    return query ? this.filteredServiceResults() : this.uniqueFavourites();
  });

  ngOnInit(): void {
    this.loadGroupedFavorites();

    if (isPlatformBrowser(this.platformId)) {
      this.restoreScrollPosition();
      window.addEventListener('beforeunload', this.saveScrollPosition);

      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => this.saveScrollPosition());
    }

    // Update filtered movies list when search query changes
    this.movieSearchService.searchQuery$.subscribe(() => {
      const allFavourites = this.uniqueFavourites();
      this.movieSearchService.updateFilteredMovies(allFavourites);
    });
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('favouritesScroll');
      window.removeEventListener('beforeunload', this.saveScrollPosition);
    }
  }

  loadGroupedFavorites(): void {
    this.groupedFavourites.set(this.favouriteService.groupByGenre());
  }

  remove(id: string): void {
    this.favouriteService.removeFavorite(id);
    this.loadGroupedFavorites();
    this.showToast('Deleted from favourites!');
  }

  showToast(message: string): void {
    const toastEl = document.getElementById('toast-message');
    const toastBody = toastEl?.querySelector('.toast-body');

    if (toastEl && toastBody) {
      toastBody.textContent = message;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  scrollToMovie(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      this.activeCardId = id;

      setTimeout(() => {
        this.activeCardId = null;
      }, 2000);
    }
  }

  saveScrollPosition = (): void => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favouritesScroll', scrollPos.toString());
    }
  };

  restoreScrollPosition(): void {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('favouritesScroll');
      if (saved) {
        setTimeout(() => {
          window.scrollTo({ top: +saved, behavior: 'smooth' });
        }, 0);
      }
    }
  }

  uniqueFavourites(): Movie[] {
    const all = this.groupedFavourites();
    const map = new Map<string, Movie>();

    for (const genre in all) {
      all[genre].forEach(movie => {
        if (!map.has(movie.imdb_id)) {
          map.set(movie.imdb_id, movie);
        }
      });
    }

    return Array.from(map.values());
  }

  selectedMovie: Movie | null = null;

  openModal(movie: Movie): void {
    this.selectedMovie = movie;
  }

  closeModal(): void {
    this.selectedMovie = null;
  }
}