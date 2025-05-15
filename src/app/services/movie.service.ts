import { Injectable } from '@angular/core';
import { forkJoin, Observable, shareReplay, switchMap, tap, timer } from 'rxjs';
import { Movie, MovieDetail } from '../models/movieAPI.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk';
  private baseUrl = 'https://api.watchmode.com/v1';

  private cache$: Observable<MovieDetail[]> | null = null;

  constructor(private http: HttpClient) {}

  getNewTitlesWithPosters(): Observable<MovieDetail[]> {
    if (!this.cache$) {
      const url = `${this.baseUrl}/list-titles/?apiKey=${this.apiKey}&types=movie&sort_by=release_date_desc&limit=60`;

      this.cache$ = this.http.get<{ titles: Movie[] }>(url).pipe(
        switchMap(response => {
          const titles = response.titles.slice(0, 60);
          const detailRequests = titles.map((item: Movie) =>
            this.getMovieById(item.id)
          );
          return forkJoin(detailRequests);
        }),
        shareReplay(1),
        tap(() => {
          timer(5 * 60 * 1000).subscribe(() => this.cache$ = null);
        })
      );
    }
    return this.cache$;
  }

  getMovieById(id: string): Observable<MovieDetail> {
    const url = `${this.baseUrl}/title/${id}/details/?apiKey=${this.apiKey}&append_to_response=sources&limit=60`;

    return this.http.get<MovieDetail>(url).pipe(
      tap(response => {
        console.log('Movie Details:', response);
      })
    );
  }
}
