import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieDurationComponent } from "../movie-duration/movie-duration.component";
import { PulseAnimationComponent } from "../pulse-animation/pulse-animation.component";

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MovieDurationComponent,
    PulseAnimationComponent
],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  selectedMovie = signal<MovieDetail | null>(null);

  openModal(movie: MovieDetail): void {
    this.selectedMovie.set(movie);
  }

  closeModal(): void {
    this.selectedMovie.set(null);
  }

}
