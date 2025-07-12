import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieSearchService } from '../../services/movie-search.service';
import { distinctUntilChanged, filter, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent implements OnInit {
  titleControl = new FormControl('');
  private movieSearchService = inject(MovieSearchService);

  ngOnInit(): void {
    this.titleControl.valueChanges
      .pipe(
        filter(value => value !== null && value !== undefined),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.movieSearchService.setSearchQuery(value);
      });
  }
}
