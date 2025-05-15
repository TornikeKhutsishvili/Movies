import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MovieDetail } from '../models/movieAPI.model';

@Injectable({
  providedIn: 'root'
})
export class MovieFilterService {
  private filteredMoviesSubject = new BehaviorSubject<MovieDetail[]>([]);
  filteredMovies$ = this.filteredMoviesSubject.asObservable();

  setFilteredMovies(movies: MovieDetail[]) {
    this.filteredMoviesSubject.next(movies);
  }
}
