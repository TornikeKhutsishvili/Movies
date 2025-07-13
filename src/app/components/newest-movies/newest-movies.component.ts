import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-newest-movies',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './newest-movies.component.html',
  styleUrls: ['./newest-movies.component.css']
})
export class NewestMoviesComponent {

}
