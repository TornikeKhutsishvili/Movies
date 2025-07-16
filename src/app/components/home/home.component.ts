import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Movie, MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { PulseAnimationComponent } from '../pulse-animation/pulse-animation.component';
import { MovieDurationComponent } from '../movie-duration/movie-duration.component';
import { CaruselComponent } from '../carusel/carusel.component';
import { TopMoviesComponent } from '../top-movies/top-movies.component';
import { NewestMoviesComponent } from "../newest-movies/newest-movies.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PulseAnimationComponent,
    MovieDurationComponent,
    CaruselComponent,
    TopMoviesComponent,
    NewestMoviesComponent,
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieSearchService = inject(MovieSearchService);

  isLoading = signal(true);
  searchText = signal<string>('');
  movie = signal<Movie[]>([]);
  moviedetail = signal<MovieDetail[]>([]);

  englishMovies = computed(() =>
    this.moviedetail().filter(m => m.original_language === 'en' && !!m.posterMedium)
  );

  frenchMovies = computed(() =>
    this.moviedetail().filter(m => m.original_language === 'fr' && !!m.posterMedium)
  );

  readonly filteredMovies = signal<MovieDetail[]>([]);
  readonly searchedMovies = signal<MovieDetail[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  displayedMovies = computed(() => {
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : this.filteredMovies();
  });


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // movies
      this.movieService.getNewTitlesWithPosters().subscribe(res => {
        this.moviedetail.set(res);
        this.movie.set(res);
        this.isLoading.set(false);
      });

      // search
      this.movieSearchService.searchQuery$.subscribe(() => {
        this.movieSearchService.updateFilteredMovies(this.movie());
      });

    }
  }

  onSearchChange(): void {
    this.movieSearchService.setSearchQuery(this.searchText());
  }


  // modal
  selectedMovie: MovieDetail | null = null;

  openModal(movie: MovieDetail): void {
    this.selectedMovie = movie;
  }

  closeModal(): void {
    this.selectedMovie = null;
  }

}