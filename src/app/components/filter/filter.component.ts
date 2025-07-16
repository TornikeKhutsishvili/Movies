import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { MovieFilterService } from '../../services/movie-filter.service';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  filterForm!: FormGroup;
  movies: MovieDetail[] = [];

  years: number[] = [];
  genres: string[] = [];
  ratings: string[] = [];
  languages: string[] = [];

  private ui = inject(UiStateService);

  constructor(
    private fb: FormBuilder,
    private movieService: MovieService,
    private movieFilterService: MovieFilterService
  ) {}

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.filterForm = this.fb.group({
      year: [null],
      genre: [null],
      rating: [null],
      language: [null],
      minRuntime: [null],
      maxRuntime: [null]
    });

    this.movieService.getNewTitlesWithPosters().subscribe(data => {
      this.movies = data;

      this.years = Array.from(new Set(data.map(m => m.year))).sort((a, b) => b - a);
      this.genres = Array.from(new Set(data.flatMap(m => m.genre_names ?? []))).sort();
      this.ratings = Array.from(new Set(data.map(m => m.us_rating).filter(r => r))).sort();
      this.languages = Array.from(new Set(data.map(m => m.original_language).filter(l => l))).sort();

      this.movieFilterService.setFilteredMovies(this.movies);
    });
  }

  applyFilter() {
    const { year, genre, rating, language } = this.filterForm.value;
    const minRuntime = this.filterForm.value.minRuntime ? +this.filterForm.value.minRuntime : null;
    const maxRuntime = this.filterForm.value.maxRuntime ? +this.filterForm.value.maxRuntime : null;

    const filtered = this.movies.filter(movie => {
      const matchYear = year ? movie.year === +year : true;
      const matchGenre = genre ? movie.genre_names?.includes(genre) : true;
      const matchRating = rating ? movie.us_rating === rating : true;
      const matchLanguage = language ? movie.original_language === language : true;
      const matchMinRuntime = minRuntime !== null ? movie.runtime_minutes >= +minRuntime : true;
      const matchMaxRuntime = maxRuntime !== null ? movie.runtime_minutes <= +maxRuntime : true;

      return matchYear && matchGenre && matchRating && matchLanguage && matchMinRuntime && matchMaxRuntime;
    });

    this.movieFilterService.setFilteredMovies(filtered);
  }

  resetFilters() {
    this.filterForm.reset();
    this.movieFilterService.setFilteredMovies(this.movies);
  }


  showFilters: boolean = false;
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

}
