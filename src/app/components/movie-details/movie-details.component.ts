import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieDetail } from '../../models/movieAPI.model';
import { MovieService } from '../../services/movie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {

  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ui = inject(UiStateService);

  readonly movie = signal<MovieDetail | null>(null);

  ngOnInit(): void {
    this.ui.setLoading(true);

    const id = this.route.snapshot.paramMap.get('id');
    console.log('Movie ID:', id);

    if (id) {
      this.movieService.getMovieById(id).subscribe(data => {
        console.log('Movie data:', data);
        this.movie.set(data);
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/movie-list']);
  }

}
