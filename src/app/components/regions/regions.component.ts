import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegionsService } from '../../services/regions.service';
import { Regions } from '../../models/regions.model';

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

  private regionsService = inject(RegionsService);
  regionsArray: Regions[] = [];
  actionsMap = new Map<string, ReturnType<typeof signal>>();

  ngOnInit(): void {
    this.getRegions();
  }

  getRegions() {
    this.regionsService.getAllRegions().subscribe({
      next: (data: Regions[]) => {
        this.regionsArray = data;
        this.regionsArray.forEach(region => {
          if (!this.actionsMap.has(region.name)) {
            this.actionsMap.set(region.name, signal(''));
          }
        });
      },
      error: (err: any) => {
        console.error('Error loading regions:', err);
      }
    });
  }

  getActionSignal(regionName: string) {
    return this.actionsMap.get(regionName)!;
  }

}
