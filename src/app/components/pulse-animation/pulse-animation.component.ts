import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pulse-animation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './pulse-animation.component.html',
  styleUrls: ['./pulse-animation.component.css']
})
export class PulseAnimationComponent {

}
