import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () =>
    import('./components/movie-list/movie-list.component').then(
      m => m.MovieListComponent
    )
  },
  { path: 'movie-list', loadComponent: () =>
    import('./components/movie-list/movie-list.component').then(
      m => m.MovieListComponent
    )
  },
  { path: 'movie-list/movie-details/:id', loadComponent: () =>
    import('./components/movie-details/movie-details.component').then(
      m => m.MovieDetailsComponent
    )
  },
  { path: 'favourites', loadComponent: () =>
    import('./components/favourites/favourites.component').then(
      m => m.FavouritesComponent
    )
  },
  { path: 'watchlist', loadComponent: () =>
    import('./components/watch-list/watch-list.component').then(
      m => m.WatchListComponent
    )
  }
];
