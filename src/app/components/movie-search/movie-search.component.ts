import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../../models/movieAPI.model';
import { MovieSearchService } from '../../services/movie-search.service';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent {
  private fb = inject(FormBuilder);
  private movieSearchService = inject(MovieSearchService);

  form = this.fb.nonNullable.group({
    title: '',
    year: ''
  });

  readonly movies = signal<Movie[]>([]);
  readonly movieCount = computed(() => this.movies().length);

  constructor() {
    effect(() => {
      const value = this.form.value;

      if (value.title) {
        this.movieSearchService.searchMovies(value.title).subscribe(
          res => this.movies.set(res)
      );
      } else {
        this.movies.set([]);
      }
    });
  }
}
