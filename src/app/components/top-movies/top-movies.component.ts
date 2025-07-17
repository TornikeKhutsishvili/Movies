import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, Input, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { MovieDetail } from '../../models/movieAPI.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';
import { ModalComponent } from "../modal/modal.component";
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-top-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent
],
  templateUrl: './top-movies.component.html',
  styleUrls: ['./top-movies.component.css']
})
export class TopMoviesComponent implements OnInit {

  // @Input() movies: MovieDetail[] = [];

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieSearchService = inject(MovieSearchService);

  private ui = inject(UiStateService);
  isLoading = signal(true);

  topMovies = signal<MovieDetail[]>([]);
  selectedMovie = signal<MovieDetail | null>(null);
  searchedMovies = signal<MovieDetail[]>([]);
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
          this.isLoading.set(false);
          this.ui.setLoaded();
        },
        error: (error) => {
          console.error('Error fetching top movies:', error);
          this.isLoading.set(false);
          this.ui.setLoaded();
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
  @ViewChild('modal') modalComponent!: ModalComponent;

  openModal(movie: MovieDetail): void {
    this.modalComponent.openModal(movie);
  }

  closeModal(): void {
    this.modalComponent.closeModal();
  }

}
