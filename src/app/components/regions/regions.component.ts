import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegionsService } from '../../services/regions.service';
import { Regions } from '../../models/regions.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent implements OnInit, OnDestroy {

  private platformId = inject(PLATFORM_ID);
  private regionsService = inject(RegionsService);
  regionsArray = signal<Regions[]>([]);
  actionsMap = new Map<string, ReturnType<typeof signal>>();
  loading = signal(true);

  // Current page and items per page
  currentPage = signal(1);
  itemsPerPage = signal(20);
  isMobilePagination = signal<boolean>(false);

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // filtered
  readonly filteredRegions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.regionsArray();

    return this.regionsArray().filter(region =>
      region.name.toLowerCase().includes(query) ||
      region.country.toLowerCase().includes(query)
    );
  });

  // split page
  paginatedMovies = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredRegions().slice(start, end);
  });

  // Total pages array for iteration
  get totalPages(): number[] {
    const totalItems = this.filteredRegions().length;
    const pageCount = Math.ceil(totalItems / this.itemsPerPage());
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  // Navigation helpers
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages.length) {
      this.currentPage.set(page);
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
    this.getRegions();

    if (isPlatformBrowser(this.platformId)) {
      // responsive pagination toggle
      this.checkPaginationView();
      window.addEventListener('resize', this.checkPaginationView);
    }
  }

  getRegions() {
    this.loading.set(true);

    this.regionsService.getAllRegions().subscribe({
      next: (data: Regions[]) => {
        this.regionsArray.set(data);
        data.forEach(region => {
          if (!this.actionsMap.has(region.name)) {
            this.actionsMap.set(region.name, signal(''));
          }
        });
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading regions:', err);
        this.loading.set(false);
      }
    });
  }

  getActionSignal(regionName: string) {
    return this.actionsMap.get(regionName)!;
  }


  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('resize', this.checkPaginationView);
    }
  }

  checkPaginationView(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobilePagination.set(window.innerWidth < 420);
    }
  }

}
