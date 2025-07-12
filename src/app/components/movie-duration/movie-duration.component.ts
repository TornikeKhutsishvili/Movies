import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-duration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './movie-duration.component.html',
  styleUrls: ['./movie-duration.component.css']
})
export class MovieDurationComponent implements OnInit {

  @Input() runtimeMinutes: number = 0;

  formattedDuration: string = '00:00:00';

  progressWidth: number = 0;

  ngOnInit(): void {
    if (!this.runtimeMinutes || this.runtimeMinutes === 0) {
      this.formattedDuration = '01:30:45';
      this.progressWidth = this.getProgressWidth(90);
    } else {
      this.formattedDuration = this.formatTime(this.runtimeMinutes);
      this.progressWidth = this.getProgressWidth(this.runtimeMinutes);
    }
  }

  formatTime(totalMinutes: number): string {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const seconds = 0;

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }

  getProgressWidth(runtime: number): number {
    const maxRuntime = 600;
    const width = (runtime / maxRuntime) * 100;
    return Math.min(width, 100);
  }

}
