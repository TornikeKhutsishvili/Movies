import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Movie } from '../models/movieAPI.model';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private storageKey = 'watchlist';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getWatchlist(): Movie[] {
    if (this.isPlatformBrowser()) {
      try {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      } catch {
        return [];
      }
    }
    return [];
  }

  addToWatchlist(movie: Movie): void {
    if (this.isPlatformBrowser()) {
      const watchlist = this.getWatchlist();
      if (!watchlist.find(w => w.imdb_id === movie.imdb_id)) {
        watchlist.push(movie);
        localStorage.setItem(this.storageKey, JSON.stringify(watchlist));
      }
    }
  }

  removeFromWatchlist(id: string): void {
    if (this.isPlatformBrowser()) {
      const updated = this.getWatchlist().filter(m => m.imdb_id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }
  }

  isInWatchlist(id: string): boolean {
    if (this.isPlatformBrowser()) {
      return this.getWatchlist().some(m => m.imdb_id === id);
    }
    return false;
  }

  groupByGenre(): Record<string, Movie[]> {
    const grouped: Record<string, Movie[]> = {};
    if (this.isPlatformBrowser()) {
      const watchlist = this.getWatchlist();
      watchlist.forEach(movie => {
        if (Array.isArray(movie.genre_names)) {
          movie.genre_names.forEach(genre => {
            if (!grouped[genre]) grouped[genre] = [];
            grouped[genre].push(movie);
          });
        }
      });
    }
    return grouped;
  }
}