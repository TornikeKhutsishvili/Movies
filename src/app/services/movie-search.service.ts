import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Movie } from '../models/movieAPI.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieSearchService {
  private apiKey = 'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk';
  private baseUrl = 'https://api.watchmode.com/v1';

  private filteredMoviesSubject = new BehaviorSubject<Movie[]>([]);
  searchedMovies$ = this.filteredMoviesSubject.asObservable();

  constructor(private http: HttpClient) {}

  setSearchedMovies(movies: Movie[]) {
    this.filteredMoviesSubject.next(movies);
  }

  searchMovies(title: string, type?: 'movie' | 'tv' | 'anime'): Observable<Movie[]> {
    const url = `${this.baseUrl}/search/`;
    const params: any = {
      apiKey: this.apiKey,
      search_value: title
    };

    if (type) {
      params.search_type = type;
    }

    return this.http.get<{ results: Movie[] }>(url, { params }).pipe(
      map(response => response.results)
    );
  }
}
