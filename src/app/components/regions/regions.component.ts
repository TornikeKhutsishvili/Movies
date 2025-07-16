import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegionsService } from '../../services/regions.service';
import { Regions } from '../../models/regions.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieSearchService } from '../../services/movie-search.service';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-regions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './regions.component.html',
  styleUrls: ['./regions.component.css']
})
export class RegionsComponent {

  private ui = inject(UiStateService);
  private regionsService = inject(RegionsService);
  regionsArray: Regions[] = [];
  actionsMap = new Map<string, ReturnType<typeof signal>>();
  loading = true;

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // filtered
  readonly filteredRegions = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.regionsArray;

    return this.regionsArray.filter(region =>
      region.name.toLowerCase().includes(query) ||
      region.country.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.getRegions();
  }

  getRegions() {
    this.loading = true;
    this.regionsService.getAllRegions().subscribe({
      next: (data: Regions[]) => {
        this.regionsArray = data;
        data.forEach(region => {
          if (!this.actionsMap.has(region.name)) {
            this.actionsMap.set(region.name, signal(''));
          }
        });
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading regions:', err);
        this.loading = false;
      }
    });
  }

  getActionSignal(regionName: string) {
    return this.actionsMap.get(regionName)!;
  }

}