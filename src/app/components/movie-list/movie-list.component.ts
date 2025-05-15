import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../../models/movieAPI.model';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CaruselComponent } from "../carusel/carusel.component";
import { FilterComponent } from "../filter/filter.component";
import { MovieFilterService } from '../../services/movie-filter.service';
import { MovieSearchService } from '../../services/movie-search.service';
import { MovieSearchComponent } from "../movie-search/movie-search.component";

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    CaruselComponent,
    FilterComponent,
    MovieSearchComponent
],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {

  private movieService = inject(MovieService);
  private movieFilterService = inject(MovieFilterService);
  private movieSearchService = inject(MovieSearchService);
  movie = signal<Movie[]>([]);
  isLoading = true;
  favoriteMovies: Set<string> = new Set();
  watchlistMovies: Set<string> = new Set();
  private platformId = inject(PLATFORM_ID);
  filteredMovies = signal<Movie[]>([]);
  searchedMovies = signal<Movie[]>([]);

  // Current page and items per page
  currentPage = signal(1);
  itemsPerPage = 20;

  // Paged movie list (already correct)
  readonly pagedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.movie().slice(start, end);
  });

  // split page
  paginatedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.movie().slice(start, end);
  });

  // Total pages array for iteration
  get totalPages(): number[] {
    const totalItems = this.movie().length;
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



  // favourites
  toggleFavorite(movie: Movie): void {
    if (this.favoriteMovies.has(movie.imdb_id)) {
      this.favoriteMovies.delete(movie.imdb_id);
    } else {
      this.favoriteMovies.add(movie.imdb_id);
    }
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('favoriteIds', JSON.stringify(Array.from(this.favoriteMovies)));
    }
  }

  isFavorite(movie: Movie): boolean {
    return this.favoriteMovies.has(movie.imdb_id);
  }


  // watch-list
  toggleWatchlist(movie: Movie): void {
    if (this.watchlistMovies.has(movie.imdb_id)) {
      this.watchlistMovies.delete(movie.imdb_id);
    } else {
      this.watchlistMovies.add(movie.imdb_id);
    }
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('watchlistIds', JSON.stringify(Array.from(this.watchlistMovies)));
    }
  }

  isInWatchlist(movie: Movie): boolean {
    return this.watchlistMovies.has(movie.imdb_id);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // movies
      this.movieService.getNewTitlesWithPosters().subscribe(res => {
        this.movie.set(res);
        this.isLoading = false;
        this.movieFilterService.setFilteredMovies(res);
        this.movieSearchService.setSearchedMovies(res);
      });

      // movie filter service
        this.movieFilterService.filteredMovies$.subscribe(filtered => {
        this.filteredMovies.set(filtered);
      });

      // movie search service
        this.movieSearchService.searchedMovies$.subscribe(searched => {
        this.searchedMovies.set(searched);
      });


      // favourites
      const storedFavourites = localStorage.getItem('favoriteIds');
      if (storedFavourites) {
        this.favoriteMovies = new Set(JSON.parse(storedFavourites));
      }


      // watch-list
      const storedwatchlist = localStorage.getItem('watchlistIds');
      if (storedwatchlist) {
        this.watchlistMovies = new Set(JSON.parse(storedwatchlist));
      }
    }
  }
}
