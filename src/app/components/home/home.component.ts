import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnInit, PLATFORM_ID, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { CaruselComponent } from '../carusel/carusel.component';
import { TopMoviesComponent } from '../top-movies/top-movies.component';
import { NewestMoviesComponent } from "../newest-movies/newest-movies.component";
import { ModalComponent } from "../modal/modal.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CaruselComponent,
    TopMoviesComponent,
    NewestMoviesComponent,
    ModalComponent
],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private platformId = inject(PLATFORM_ID);
  private movieService = inject(MovieService);

  isLoading = signal(true);
  moviedetail = signal<MovieDetail[]>([]);

  englishMovies = computed(() =>
    this.moviedetail().filter(m => m.original_language === 'en' && !!m.posterMedium)
  );

  frenchMovies = computed(() =>
    this.moviedetail().filter(m => m.original_language === 'fr' && !!m.posterMedium)
  );

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      // movies
      this.movieService.getNewTitlesWithPosters().subscribe(res => {
        this.moviedetail.set(res);
        this.isLoading.set(false);
      });
    }
  }


  // modal
  @ViewChild('modal') modalComponent!: ModalComponent;

  openModal(moviedetail: MovieDetail): void {
    this.modalComponent.openModal(moviedetail);
  }

  closeModal(): void {
    this.modalComponent.closeModal();
  }

}