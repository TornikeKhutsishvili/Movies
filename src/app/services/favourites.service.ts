import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Movie } from '../models/movieAPI.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FavouritesService {
  private storageKey = 'favorites';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getFavorites(): Movie[] {
    if (this.isPlatformBrowser()) {
      try {
        return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
      } catch {
        return [];
      }
    }
    return [];
  }

  addFavorite(movie: Movie): void {
    if (this.isPlatformBrowser()) {
      const favorites = this.getFavorites();
      if (!favorites.find(f => f.imdb_id === movie.imdb_id)) {
        favorites.push(movie);
        localStorage.setItem(this.storageKey, JSON.stringify(favorites));
      }
    }
  }

  removeFavorite(id: string): void {
    if (this.isPlatformBrowser()) {
      const updated = this.getFavorites().filter(m => m.imdb_id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(updated));
    }
  }

  isFavorite(id: string): boolean {
    if (this.isPlatformBrowser()) {
      return this.getFavorites().some(m => m.imdb_id === id);
    }
    return false;
  }

  groupByGenre(): Record<string, Movie[]> {
    const grouped: Record<string, Movie[]> = {};
    if (this.isPlatformBrowser()) {
      const favorites = this.getFavorites();
      favorites.forEach(movie => {
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
