import { Injectable } from '@angular/core';
import { Movie } from '../models/movieAPI.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieSearchService {

  private searchQuerySubject = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySubject.asObservable();

  private filteredMoviesSubject = new BehaviorSubject<Movie[]>([]);
  filteredMovies$ = this.filteredMoviesSubject.asObservable();

  setSearchQuery(query: string) {
    this.searchQuerySubject.next(query);
  }

  updateFilteredMovies(allMovies: Movie[]) {
    const query = this.searchQuerySubject.getValue().toLowerCase();
    console.log('[SEARCH]', query);

    const filtered = allMovies.filter(movie =>
      movie.title.toLowerCase().includes(query)
    );

    this.filteredMoviesSubject.next(filtered);
  }

}
