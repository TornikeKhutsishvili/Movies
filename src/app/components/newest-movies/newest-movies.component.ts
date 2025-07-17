import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, Input, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';
import { MovieService } from '../../services/movie.service';
import { ModalComponent } from "../modal/modal.component";
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-newest-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent
],
  templateUrl: './newest-movies.component.html',
  styleUrls: ['./newest-movies.component.css']
})
export class NewestMoviesComponent implements OnInit {

  @Input() movies: MovieDetail[] = [];

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private movieSearchService = inject(MovieSearchService);

  private ui = inject(UiStateService);
  isLoading = signal(true);

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
          this.isLoading.set(false);
          this.ui.setLoaded();
        },
        error: (error) => {
          console.error('Error fetching newest movies:', error);
          this.isLoading.set(false);
          this.ui.setLoaded();
        }
      });

      // search
      this.movieSearchService.searchQuery$.subscribe(() => {
        this.movieSearchService.updateFilteredMovies(this.newestMovies());
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
