import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { forkJoin, Observable, shareReplay, switchMap, tap, timer } from 'rxjs';
import { MovieDetail } from '../models/movieAPI.model';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiKey = [
    't0XNBuNEaL4lMfCVvx90ks41SrlQlWynqX5gqGB3',
    'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk',
    'nYKWjq7aJRd5Q8xKkUyFSGGtMPfuBO2JCk8OUia8',
  ];


  private readonly lastSwitchKey = 'api_key_last_switch';
  private readonly currentIndexKey = 'api_key_index';

  private baseUrl = 'https://api.watchmode.com/v1';
  private cache$: Observable<MovieDetail[]> | null = null;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}



  // The following method is commented out because it was switching the API key every month.

  // private getApiKey(): string {
  //   let index = 0;

  //   if (isPlatformBrowser(this.platformId)) {
  //     const now = new Date();
  //     const lastSwitchStr = localStorage.getItem(this.lastSwitchKey);
  //     const currentIndexStr = localStorage.getItem(this.currentIndexKey);

  //     index = currentIndexStr ? parseInt(currentIndexStr, 10) : 0;
  //     const lastSwitch = lastSwitchStr ? new Date(lastSwitchStr) : new Date(0);

  //     const oneMonthLater = new Date(lastSwitch);
  //     oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  //     if (now >= oneMonthLater) {
  //       index = (index + 1) % this.apiKey.length;
  //       localStorage.setItem(this.currentIndexKey, index.toString());
  //       localStorage.setItem(this.lastSwitchKey, now.toISOString());
  //     }
  //   }

  //   return this.apiKey[index];
  // }



  // workaround for the issue with the API key switching every 25 days
  // This method will switch the API key every 25 days

  private getApiKey(): string {
    let index = 0;

    if (isPlatformBrowser(this.platformId)) {
      const now = new Date();
      const lastSwitchStr = localStorage.getItem(this.lastSwitchKey);
      const currentIndexStr = localStorage.getItem(this.currentIndexKey);

      index = currentIndexStr ? parseInt(currentIndexStr, 10) : 0;
      const lastSwitch = lastSwitchStr ? new Date(lastSwitchStr) : new Date(0);

      const diffInMs = now.getTime() - lastSwitch.getTime();
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24); // ms → days

      if (diffInDays >= 25) {
        index = (index + 1) % this.apiKey.length;
        localStorage.setItem(this.currentIndexKey, index.toString());
        localStorage.setItem(this.lastSwitchKey, now.toISOString());
      }
    }

    return this.apiKey[index];
  }


  getNewTitlesWithPosters(): Observable<MovieDetail[]> {
    if (!this.cache$) {
      const apiKey = this.getApiKey();
      const url = `${this.baseUrl}/list-titles/?apiKey=${apiKey}&types=movie&sort_by=release_date_desc&limit=60`;

      this.cache$ = this.http.get<{ titles: MovieDetail[] }>(url).pipe(
        switchMap(response => {
          const titles = response.titles.slice(0, 60);
          const detailRequests = titles.map((item: MovieDetail) =>
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
    const apiKey = this.getApiKey();
    const url = `${this.baseUrl}/title/${id}/details/?apiKey=${apiKey}&append_to_response=sources&limit=60`;

    return this.http.get<MovieDetail>(url).pipe(
      tap(response => {
        return response;
      })
    );
  }

}
