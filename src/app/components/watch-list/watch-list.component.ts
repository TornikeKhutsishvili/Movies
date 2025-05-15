import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WatchlistService } from '../../services/watch-list.service';
import { Movie } from '../../models/movieAPI.model';

declare const bootstrap: any;

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {
  constructor(private watchlistService: WatchlistService) {}

  ngOnInit(): void {}

  groupedWatchList(): Record<string, Movie[]> {
    return this.watchlistService.groupByGenre();
  }

  remove(imdb_id: string): void {
    this.watchlistService.removeFromWatchlist(imdb_id);
    this.showToast('ფილმი წარმატებით წაიშალა საყურებელი სიიდან!');
  }

  showToast(message: string): void {
    const toastEl = document.getElementById('toast-message');
    const toastBody = toastEl?.querySelector('.toast-body');

    if (toastEl && toastBody) {
      toastBody.textContent = message;

      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
}
