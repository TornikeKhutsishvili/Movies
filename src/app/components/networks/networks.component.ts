import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NetworksService } from '../../services/networks.service';
import { Networks } from '../../models/networksAPI.model';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-networks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent {

  private ui = inject(UiStateService);
  private networksService = inject(NetworksService);
  networkArray = signal<Networks[]>([]);
  actionsMap = signal<Map<number, WritableSignal<string>>>(new Map());

  loading = signal(true);

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // filter
  readonly filteredNetworks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if(!query){
      return this.networkArray;
    }

    return this.networkArray().filter(networkFilt =>
      networkFilt.name.toLowerCase().includes(query) ||
      networkFilt.origin_country.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.getNetworks();
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

}