import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, effect, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie, MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { MovieFilterService } from '../../services/movie-filter.service';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PulseAnimationComponent } from '../pulse-animation/pulse-animation.component';
import { MovieDurationComponent } from '../movie-duration/movie-duration.component';
import { CaruselComponent } from '../carusel/carusel.component';
import { TopMoviesComponent } from '../top-movies/top-movies.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PulseAnimationComponent,
    MovieDurationComponent,
    CaruselComponent,
    TopMoviesComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieFilterService = inject(MovieFilterService);
  private movieSearchService = inject(MovieSearchService);

  click = signal(0);

  isLoading = true;
  searchText: string = '';
  movie = signal<Movie[]>([]);
  moviedetail = signal<MovieDetail[]>([]);

  readonly filteredMovies = signal<Movie[]>([]);
  searchedMovies = signal<Movie[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  displayedMovies = computed(() => {
    const filtered = this.filteredMovies();
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : filtered;
  });


  // filter:
  constructor() {
    effect(() => {
      this.movieFilterService.filteredMovies$.subscribe(this.filteredMovies.set);
    });
  }


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // movies
      this.movieService.getNewTitlesWithPosters().subscribe(res => {
        this.movie.set(res);
        this.isLoading = false;
        this.movieFilterService.setFilteredMovies(res);
      });

      // movie filter service
      this.movieFilterService.filteredMovies$.subscribe(filtered => {
        this.filteredMovies.set(filtered);
      });

      // search
      this.movieSearchService.searchQuery$.subscribe(() => {
        this.movieSearchService.updateFilteredMovies(this.movie());
      });

      this.movieSearchService.filteredMovies$.subscribe(searched => {
        this.searchedMovies.set(searched);
      });

    }
  }


  selectedMovie: Movie | null = null;

  openModal(movie: Movie): void {
    this.selectedMovie = movie;
  }

  closeModal(): void {
    this.selectedMovie = null;
  }

}