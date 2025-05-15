import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Movie } from '../../models/movieAPI.model';
import { FavouritesService } from '../../services/favourites.service';

declare const bootstrap: any;

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit {
  private favouriteService = inject(FavouritesService);
  readonly groupedFavourites = signal<Record<string, Movie[]>>({});

  ngOnInit(): void {
    this.loadGroupedFavorites();
  }

  loadGroupedFavorites(): void {
    this.groupedFavourites.set(this.favouriteService.groupByGenre());
  }

  remove(id: string): void {
    this.favouriteService.removeFavorite(id);
    this.loadGroupedFavorites();
    this.showToast('ფავორიტიდან წაიშალა!');
  }

  showToast(message: string): void {
    const toastEl = document.getElementById('toast-message');
    const toastBody = document.querySelector('#toast-message .toast-body');
    if (toastEl && toastBody) {
      toastBody.textContent = message;
      // Assuming bootstrap is globally available
      new bootstrap.Toast(toastEl).show();
    }
  }
}
