import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  actorsList = signal<Actors[]>([]);
  actionsMap = new Map<string, ReturnType<typeof signal>>();
  loading = true;
  error = false;
  selectedActorId: number | null = null;

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
    this.loading = true;
    this.error = false;

    this.actorsService.getAllActors().subscribe({
      next: (data: Actors[]) => {
        this.actorsList.set(data);
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  selectActor(id: number): void {
    this.selectedActorId = id;
    console.log("Selected Actor ID:", id);
  }

  trackById(index: number, actor: Actors): number {
    return actor.id;
  }

}