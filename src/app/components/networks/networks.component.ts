import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  ],
  templateUrl: './networks.component.html',
  styleUrls: ['./networks.component.css']
})
export class NetworksComponent {

  private networksService = inject(NetworksService);
  networkArray: Networks[] = [];
  actionsMap = new Map<number, ReturnType<typeof signal>>();

  loading = true;

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  // filter
  readonly filteredNetworks = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if(!query){
      return this.networkArray;
    }

    return this.networkArray.filter(networkFilt =>
      networkFilt.name.toLowerCase().includes(query) ||
      networkFilt.origin_country.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.getNetworks();
  }

  getNetworks() {
    this.loading = true;
    this.networksService.getNetworks().subscribe({
      next: (data: Networks[]) => {
        this.networkArray = data;

        this.networkArray.forEach(n => {
          if (!this.actionsMap.has(n.id)) {
            this.actionsMap.set(n.id, signal(''));
          }
        });

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading networks:', err);
        this.loading = false;
      }
    });
  }

  getActionSignal(networkId: number) {
    return this.actionsMap.get(networkId)!;
  }

  // like or dislike
  onLike(network: Networks) {
    this.getActionSignal(network.id).set('Liked');
    console.log('Liked:', network.name);
  }

  onUnlike(network: Networks) {
    this.getActionSignal(network.id).set('Unliked');
    console.log('Unliked:', network.name);
  }

}