import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { MovieDetail } from '../../models/movieAPI.model';
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

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);
  private ui = inject(UiStateService);
  isLoading = signal(true);

  topMovies = signal<MovieDetail[]>([]);
  readonly highRatedMovies = computed(() =>
    this.topMovies().filter(m => parseFloat(m.user_rating || '0') >= 8 && !!m.posterMedium)
  );

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