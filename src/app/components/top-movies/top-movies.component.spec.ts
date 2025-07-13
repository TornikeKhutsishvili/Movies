import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMoviesComponent } from './top-movies.component';

describe('TopMoviesComponent', () => {
  let component: TopMoviesComponent;
  let fixture: ComponentFixture<TopMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
