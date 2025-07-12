import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieDurationComponent } from './movie-duration.component';

describe('MovieDurationComponent', () => {
  let component: MovieDurationComponent;
  let fixture: ComponentFixture<MovieDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
