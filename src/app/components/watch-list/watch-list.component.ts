import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WatchlistService } from '../../services/watch-list.service';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalComponent } from "../modal/modal.component";

declare const bootstrap: any;

@Component({
  selector: 'app-watch-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent
],
  templateUrl: './watch-list.component.html',
  styleUrls: ['./watch-list.component.css']
})
export class WatchListComponent implements OnInit {

  watchlist = signal<MovieDetail[]>([]);

  constructor(private watchlistService: WatchlistService) {}

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  readonly filteredWatchlist = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return query
      ? this.watchlist().filter(m =>
          m.title.toLowerCase().includes(query) ||
          m.genre_names?.some(g => g.toLowerCase().includes(query))
        )
      : this.watchlist();
  });


  // date
  ScheduleWatchList(): { [date: string]: MovieDetail[] } {
    const list = this.filteredWatchlist();
    const grouped: { [key: string]: MovieDetail[] } = {};

    for (const movie of list) {
      const date = movie.addedAt ? movie.addedAt.slice(0, 10) : 'Unknown';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(movie);
    }

    return grouped;
  }

  ngOnInit(): void {
    this.watchlistService.watchlist$.subscribe(watchlist => {
      this.watchlist.set(watchlist);
    });
  }

  remove(imdb_id: string): void {
    this.watchlistService.removeFromWatchlist(imdb_id);
    this.showToast('The movie was successfully removed from the watchlist!');
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



  // modal
  @ViewChild('modal') modalComponent!: ModalComponent;

  openModal(movie: MovieDetail): void {
    this.modalComponent.openModal(movie);
  }

  closeModal(): void {
    this.modalComponent.closeModal();
  }

}
