import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'movie-list', pathMatch: 'full' },
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
  },
  { path: 'networks', loadComponent: () =>
    import('./components/networks/networks.component').then(
      m => m.NetworksComponent
    )
  },
  { path: 'actors', loadComponent: () =>
    import('./components/actors/actors.component').then(
      m => m.ActorsComponent
    )
  },
  { path: 'regions', loadComponent: () =>
    import('./components/regions/regions.component').then(
      m => m.RegionsComponent
    )
  }
];
