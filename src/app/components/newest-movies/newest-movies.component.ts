import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie, MovieDetail } from '../../models/movieAPI.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';
import { MovieService } from '../../services/movie.service';
import { MovieDurationComponent } from "../movie-duration/movie-duration.component";
import { PulseAnimationComponent } from "../pulse-animation/pulse-animation.component";

@Component({
  selector: 'app-newest-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieDurationComponent,
    PulseAnimationComponent
],
  templateUrl: './newest-movies.component.html',
  styleUrls: ['./newest-movies.component.css']
})
export class NewestMoviesComponent {
  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieSearchService = inject(MovieSearchService);
  isLoading = true;

  movie = signal<Movie[]>([]);
  newestMovies = signal<MovieDetail[]>([]);
  selectedMovie = signal<MovieDetail | null>(null);
  searchedMovies = signal<MovieDetail[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  readonly filteredNewestMovies = computed(() =>
    this.newestMovies().filter(m => (m.release_date?.startsWith('2026') || m.release_date > '2026') && !!m.posterMedium)
  );

  readonly displayedMovies = computed(() => {
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : this.filteredNewestMovies();
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {

      this.movieService.getNewTitlesWithPosters().subscribe({
        next: (movies: MovieDetail[]) => {
          this.newestMovies.set(movies);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching newest movies:', error);
          this.isLoading = false;
        }
      });

      // search
      this.movieSearchService.searchQuery$.subscribe(() => {
        this.movieSearchService.updateFilteredMovies(this.newestMovies());
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
