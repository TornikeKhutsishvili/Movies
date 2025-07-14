import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieDetail } from '../../models/movieAPI.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';
import { PulseAnimationComponent } from "../pulse-animation/pulse-animation.component";
import { MovieDurationComponent } from "../movie-duration/movie-duration.component";

@Component({
  selector: 'app-top-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PulseAnimationComponent,
    MovieDurationComponent
],
  templateUrl: './top-movies.component.html',
  styleUrls: ['./top-movies.component.css']
})
export class TopMoviesComponent {
  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieSearchService = inject(MovieSearchService);
  isLoading = true;

  movie = signal<Movie[]>([]);
  topMovies = signal<MovieDetail[]>([]);
  selectedMovie = signal<MovieDetail | null>(null);
  searchedMovies = signal<Movie[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  readonly highRatedMovies = computed(() =>
    this.topMovies().filter(m => parseFloat(m.user_rating || '0') >= 8 && !!m.posterMedium)
  );

  displayedMovies = computed(() => {
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : this.topMovies();
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      this.movieService.getNewTitlesWithPosters().subscribe({
        next: (movies: MovieDetail[]) => {
          this.topMovies.set(movies);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching top movies:', error);
          this.isLoading = false;
        }
      });

      // search
      this.movieSearchService.searchQuery$.subscribe(() => {
        this.movieSearchService.updateFilteredMovies(this.topMovies());
      });

      this.movieSearchService.filteredMovies$.subscribe(searched => {
        this.searchedMovies.set(searched);
      });

    }
  }

  // modal
  openModal(movie: MovieDetail): void {
    this.selectedMovie.set(movie);
  }

  closeModal(): void {
    this.selectedMovie.set(null);
  }
}
