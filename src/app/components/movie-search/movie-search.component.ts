import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MovieSearchService } from '../../services/movie-search.service';
import { distinctUntilChanged, filter } from 'rxjs';
import { UiStateService } from '../../services/ui-state.service';

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
  private ui = inject(UiStateService);

  ngOnInit(): void {
    this.ui.setLoading(true);

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
