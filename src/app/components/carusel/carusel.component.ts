import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { interval, Subscription } from 'rxjs';
import { UiStateService } from '../../services/ui-state.service';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';

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

  @Input() movies: MovieDetail[] = [];
  @Output() movieClicked = new EventEmitter<MovieDetail>();

  currentIndex = signal<number>(0);
  visibleCount = signal<number>(8);
  slideInterval = signal<number>(4000);
  intervalSub?: Subscription;

  private ui = inject(UiStateService);
  private movieSearchService = inject(MovieSearchService);
  searchText = signal<string>('');

  readonly searchedMovies = signal<MovieDetail[]>([]);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  displayedMovies = computed(() => {
    const searched = this.searchedMovies();
    const search = this.searchQuery().trim();

    return search ? searched : this.visibleMovies;
  });

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.updateVisibleCount();
    window.addEventListener('resize', this.updateVisibleCount);

    if (this.movies.length === 0) {
      this.movieService.getNewTitlesWithPosters().subscribe(data => {
        this.movies = data.filter(m => m.posterMedium);
        this.startAutoSlide();
        this.ui.setLoaded();
      });
    } else {
      this.startAutoSlide();
      this.ui.setLoaded();
    }

    // search query
    this.movieSearchService.searchQuery$.subscribe(() => {
      this.movieSearchService.updateFilteredMovies(this.movies);
    });

    // filtered results
    this.movieSearchService.filteredMovies$.subscribe(filtered => {
      this.searchedMovies.set(filtered);
    });

  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    window.removeEventListener('resize', this.updateVisibleCount);
  }

  updateVisibleCount = () => {
    const width = window.innerWidth;
    if (width <= 500) this.visibleCount.set(2);
    else if (width <= 700) this.visibleCount.set(3);
    else if (width <= 900) this.visibleCount.set(4);
    else if (width <= 1100) this.visibleCount.set(5);
    else if (width <= 1300) this.visibleCount.set(6);
    else if (width <= 1500) this.visibleCount.set(7);
    else this.visibleCount.set(8);
  };

  startAutoSlide() {
    this.intervalSub = interval(this.slideInterval()).subscribe(() => this.nextSlide());
  }

  stopAutoSlide() {
    this.intervalSub?.unsubscribe();
  }

  nextSlide() {
    if (this.movies.length > 0) {
      this.currentIndex.set((this.currentIndex() + 1) % this.movies.length);
    }
  }

  prevSlide() {
    if (this.movies.length > 0) {
      this.currentIndex.set((this.currentIndex() - 1 + this.movies.length) % this.movies.length);
    }
  }

  get visibleMovies(): MovieDetail[] {
    const result: MovieDetail[] = [];
    for (let i = 0; i < this.visibleCount() && this.movies.length > 0; i++) {
      const index = (this.currentIndex() + i) % this.movies.length;
      result.push(this.movies[index]);
    }
    return result;
  }

  onMovieClick(movie: MovieDetail): void {
    this.movieClicked.emit(movie);
  }

}
