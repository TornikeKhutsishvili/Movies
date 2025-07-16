import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { FilterComponent } from "../filter/filter.component";
import { MovieFilterService } from '../../services/movie-filter.service';
import { MovieSearchService } from '../../services/movie-search.service';
import { FavouritesService } from '../../services/favourites.service';
import { WatchlistService } from '../../services/watch-list.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    FilterComponent,
    ModalComponent
],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private watchlistService = inject(WatchlistService);
  private movieFilterService = inject(MovieFilterService);
  private movieSearchService = inject(MovieSearchService);
  private favouriteService = inject(FavouritesService);

  isLoading = signal(true);
  searchText = signal<string>('');
  favoriteMovies: Set<string> = new Set();
  watchlistMovies: Set<string> = new Set();
  movie = signal<MovieDetail[]>([]);

  readonly filteredMovies = signal<MovieDetail[]>([]);
  searchedMovies = signal<MovieDetail[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // Current page and items per page
  currentPage = signal(1);
  itemsPerPage = 18;
  isMobilePagination: boolean = false;

  displayedMovies = computed(() => {
    const filtered = this.filteredMovies();
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : filtered;
  });

  // split page
  paginatedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.displayedMovies().slice(start, end);
  });

  // Total pages array for iteration
  get totalPages(): number[] {
    const totalItems = this.displayedMovies().length;
    const pageCount = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  // Navigation helpers
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage.set(page);
    }
  }

  goToFirstPage(): void {
    this.currentPage.set(1);
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages.length);
  }


  // filter:
  constructor() {
    effect(() => {
      this.movieFilterService.filteredMovies$.subscribe(this.filteredMovies.set);
    });

    this.checkPaginationView = this.checkPaginationView.bind(this);
  }


  // favourites
  toggleFavorite(movie: MovieDetail): void {
    if (this.favouriteService.isFavorite(movie.imdb_id)) {
      this.favouriteService.removeFavorite(movie.imdb_id);
    } else {
      this.favouriteService.addFavorite(movie);
    }
  }

  isFavorite(movie: MovieDetail): boolean {
    return this.favouriteService.isFavorite(movie.imdb_id);
  }


  // watch-list
  toggleWatchlist(movie: MovieDetail): void {
    if (this.watchlistMovies.has(movie.imdb_id)) {
      this.watchlistService.removeFromWatchlist(movie.imdb_id);
    } else {
      this.watchlistService.addToWatchlist(movie);
    }
    const updatedList = this.watchlistService.getWatchlist();
    this.watchlistMovies = new Set(updatedList.map(m => m.imdb_id));
  }

  isInWatchlist(movie: MovieDetail): boolean {
    return this.watchlistMovies.has(movie.imdb_id);
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // movies
      this.movieService.getNewTitlesWithPosters().subscribe(res => {
        this.movie.set(res);
        this.isLoading.set(false);
        this.movieFilterService.setFilteredMovies(res);
      });


      // movie filter service
      this.movieFilterService.filteredMovies$.subscribe(filtered => {
        this.filteredMovies.set(filtered);
      });


      // favourites
      const storedFavourites = localStorage.getItem('favoriteIds');
      if (storedFavourites) {
        this.favoriteMovies = new Set(JSON.parse(storedFavourites));
      }


      // watchlist — load from service list
      const currentWatchlist = this.watchlistService.getWatchlist();
      this.watchlistMovies = new Set(currentWatchlist.map(m => m.imdb_id));


      // subscribe changes, that realtime updates in watchlistMovies
      this.watchlistService.watchlist$.subscribe(movies => {
        this.watchlistMovies = new Set(movies.map(m => m.imdb_id));
      });


      // search
      this.movieSearchService.searchQuery$.subscribe(() => {
        this.movieSearchService.updateFilteredMovies(this.movie());
      });

      this.movieSearchService.filteredMovies$.subscribe(searched => {
        this.searchedMovies.set(searched);
      });


      // responsive pagination toggle
      this.checkPaginationView();
      window.addEventListener('resize', this.checkPaginationView);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.checkPaginationView);
    }
  }

  checkPaginationView(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobilePagination = window.innerWidth < 420;
    }
  }


  // modal
  @ViewChild('modal') modalComponent!: ModalComponent;

  openModal(movie: MovieDetail): void {
    this.modalComponent.openModal(movie);
  }

  closeModal(): void {
    this.modalComponent.closeModal();
  }

}