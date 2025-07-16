import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MovieDetail } from '../models/movieAPI.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  private storageKey = 'watchlist';
  private isBrowser: boolean;
  private watchlistSubject = new BehaviorSubject<MovieDetail[]>([]);

  watchlist$ = this.watchlistSubject.asObservable();


  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      const loaded = this.loadWatchlist();
      this.watchlistSubject.next(loaded);
    }
  }


  private loadWatchlist(): MovieDetail[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }


  private saveWatchlist(watchlist: MovieDetail[]) {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(watchlist));
    }
    this.watchlistSubject.next(watchlist);
  }


  getWatchlist(): MovieDetail[] {
    return this.watchlistSubject.value;
  }


  addToWatchlist(movie: MovieDetail): void {
    const watchlist = this.getWatchlist();
    if (!watchlist.find(w => w.imdb_id === movie.imdb_id)) {
      const movieWithDate = { ...movie, addedAt: new Date().toISOString() };
      this.saveWatchlist([...watchlist, movieWithDate]);
    }
  }


  removeFromWatchlist(id: string): void {
    const updated = this.getWatchlist().filter(m => m.imdb_id !== id);
    this.saveWatchlist(updated);
  }


  isInWatchlist(id: string): boolean {
    return this.getWatchlist().some(m => m.imdb_id === id);
  }

}
