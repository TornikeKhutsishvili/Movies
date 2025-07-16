import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', loadComponent: () =>
    import('./components/home/home.component').then(
      m => m.HomeComponent
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
  },

  { path: 'login', loadComponent: () =>
    import('./components/auth/login/login.component').then(
      m => m.LoginComponent
    )
  },

  { path: 'register', loadComponent: () =>
    import('./components/auth/register/register.component').then(
      m => m.RegisterComponent
    )
  },

  {
    path: 'profile',
    loadComponent: () => import('./components/auth/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard]
  },

  {
    path: 'reset-password',
    loadComponent: () => import('./components/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    canActivate: [authGuard]
  },

  {
    path: 'edit-profile',
    loadComponent: () => import('./components/auth/edit-profile/edit-profile.component').then(m => m.EditProfileComponent),
    canActivate: [authGuard]
  },

  { path: 'footer', loadComponent: () =>
    import('./components/footer/footer.component').then(
      m => m.FooterComponent
    )
  }

];
