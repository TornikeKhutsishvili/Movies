import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Actors } from '../../models/actors.model';
import { ActorsService } from '../../services/actors.service';

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
  // actorsList: Actors[] = [];
  // loading = true;
  // error = false;
  // selectedActorId: number | null = null;

  // private actorsService = inject(ActorsService);

  // ngOnInit(): void {
  //   this.getAllActors();
  // }

  // getAllActors(): void {
  //   this.loading = true;
  //   this.error = false;

  //   this.actorsService.getAllActors().subscribe({
  //     next: (data: Actors[]) => {
  //       this.actorsList = data;
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.error = true;
  //       this.loading = false;
  //     }
  //   });
  // }

  // selectActor(id: number): void {
  //   this.selectedActorId = id;
  //   console.log("Selected Actor ID:", id);
  // }

  // trackById(index: number, actor: Actors): number {
  //   return actor.id;
  // }
}
