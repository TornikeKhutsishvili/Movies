import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movieAPI.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';

@Component({
  selector: 'app-top-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './top-movies.component.html',
  styleUrls: ['./top-movies.component.css']
})
export class TopMoviesComponent {
  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieSearchService = inject(MovieSearchService);
  isLoading = true;
  topMovies = signal<Movie[]>([]);
  searchedMovies = signal<Movie[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });


  displayedMovies = computed(() => {
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : this.topMovies();
  });

  // ngOnInit(): void {
  //   if (isPlatformBrowser(this.platformId)) {
  //     this.movieService.getTopMovies().subscribe({
  //       next: (movies: Movie) => {
  //         this.topMovies.set(movies);
  //         this.isLoading = false;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching top movies:', error);
  //         this.isLoading = false;
  //       }
  //     });

  //           // search
  //     this.movieSearchService.searchQuery$.subscribe(() => {
  //       this.movieSearchService.updateFilteredMovies(this.movie());
  //     });

  //     this.movieSearchService.filteredMovies$.subscribe(searched => {
  //       this.searchedMovies.set(searched);
  //     });
  //   }
  // }

  selectedMovie: Movie | null = null;

  openModal(movie: Movie): void {
    this.selectedMovie = movie;
  }

  closeModal(): void {
    this.selectedMovie = null;
  }
}

