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
  groupedMovies: MovieDetail[][] = [];
  currentIndex = 0;
  slideInterval = 3000;
  intervalSub?: Subscription;

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getNewTitlesWithPosters().subscribe(data => {
      this.movies = data.filter(movie => movie.posterMedium && movie.posterMedium !== '');
      this.groupedMovies = this.chunkArray(this.movies, 4);
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
    this.currentIndex = (this.currentIndex + 1) % this.groupedMovies.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.groupedMovies.length) % this.groupedMovies.length;
  }

  chunkArray(arr: any[], size: number): any[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
}