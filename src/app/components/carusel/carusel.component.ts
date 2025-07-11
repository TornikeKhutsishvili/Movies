import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-carusel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './carusel.component.html',
  styleUrls: ['./carusel.component.css']
})
export class CaruselComponent implements OnInit, OnDestroy {
  movies: MovieDetail[] = [];
  currentIndex = 0;
  slideInterval = 4000;
  intervalSub?: Subscription;
  visibleCount = 4;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getNewTitlesWithPosters().subscribe(data => {
      this.movies = data.filter(movie => movie.posterMedium && movie.posterMedium !== '');
      this.startAutoSlide();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalSub = interval(this.slideInterval).subscribe(() => {
      this.nextSlide();
    });
  }

  stopAutoSlide() {
    this.intervalSub?.unsubscribe();
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.movies.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length;
  }

  get visibleMovies(): MovieDetail[] {
    const result: MovieDetail[] = [];
    for (let i = 0; i < this.visibleCount; i++) {
      const index = (this.currentIndex + i) % this.movies.length;
      result.push(this.movies[index]);
    }
    return result;
  }

}