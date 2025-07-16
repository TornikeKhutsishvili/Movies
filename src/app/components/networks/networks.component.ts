import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworksService } from '../../services/networks.service';
import { Networks } from '../../models/networksAPI.model';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-networks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent implements OnInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);
  private networksService = inject(NetworksService);
  networkArray = signal<Networks[]>([]);
  actionsMap = signal<Map<number, WritableSignal<string>>>(new Map());

  loading = signal(true);

  // Current page and items per page
  currentPage = signal(1);
  itemsPerPage = 20;
  isMobilePagination: boolean = false;

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // filter
  readonly filteredNetworks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if(!query){
      return this.networkArray();
    }

    return this.networkArray().filter(networkFilt =>
      networkFilt.name.toLowerCase().includes(query) ||
      networkFilt.origin_country.toLowerCase().includes(query)
    );
  });

  // split page
  paginatedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredNetworks().slice(start, end);
  });

  // Total pages array for iteration
  get totalPages(): number[] {
    const totalItems = this.filteredNetworks().length;
    const pageCount = Math.ceil(totalItems / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  // Navigation helpers
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage.set(page);
    }
  }

  goToFirstPage(): void {
    this.currentPage.set(1);
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages.length);
  }

  constructor() {
    this.checkPaginationView = this.checkPaginationView.bind(this);
  }

  ngOnInit(): void {
    this.getNetworks();

    if (isPlatformBrowser(this.platformId)) {
      // responsive pagination toggle
      this.checkPaginationView();
      window.addEventListener('resize', this.checkPaginationView);
    }
  }

  getNetworks() {
    this.loading.set(true);

    this.networksService.getNetworks().subscribe({
      next: (data: Networks[]) => {
        this.networkArray.set(data);

        const updatedMap = new Map(this.actionsMap());
        data.forEach(n => {
          if (!updatedMap.has(n.id)) {
            updatedMap.set(n.id, signal(''));
          }
        });
        this.actionsMap.set(updatedMap);

        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading networks:', err);
        this.loading.set(false);
      }
    });
  }

  getActionSignal(networkId: number): WritableSignal<string> {
    const signal = this.actionsMap().get(networkId);
    if (!signal) {
      throw new Error(`No signal found for network ID: ${networkId}`);
    }
    return signal;
  }

  // like or Unlike
  onLike(network: Networks) {
    this.getActionSignal(network.id).set('Liked');
    console.log('Liked:', network.name);
  }

  onUnlike(network: Networks) {
    this.getActionSignal(network.id).set('Unliked');
    console.log('Unliked:', network.name);
  }


  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.checkPaginationView);
    }
  }

  checkPaginationView(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobilePagination = window.innerWidth < 420;
    }
  }

}