import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Actors } from '../../models/actors.model';
import { ActorsService } from '../../services/actors.service';
import { MovieSearchService } from '../../services/movie-search.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
],
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent {

  private actorsService = inject(ActorsService);

  loading = signal(true);
  error = signal(false);
  actorsList = signal<Actors[]>([]);
  selectedActorId = signal<number | null>(null);
  actionsMap = new Map<string, ReturnType<typeof signal>>();

  // search
  private movieSearchService = inject(MovieSearchService);
  readonly searchQuery = toSignal(this.movieSearchService.searchQuery$, { initialValue: '' });

  readonly filteredActors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.actorsList();

    return this.actorsList().filter(actor =>
      actor.full_name?.toLowerCase().includes(query) ||
      actor.main_profession?.toLowerCase().includes(query) ||
      actor.secondary_profession?.toLowerCase().includes(query)
    );
  });


  ngOnInit(): void {
    this.getAllActors();
  }

  getAllActors(): void {
    this.loading.set(true);
    this.error.set(false);

    this.actorsService.getAllActors().subscribe({
      next: (data: Actors[]) => {
        this.actorsList.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  selectActor(id: number): void {
    this.selectedActorId.set(id);
    console.log("Selected Actor ID:", id);
  }

  trackById(index: number, actor: Actors): number {
    return actor.id;
  }

}
