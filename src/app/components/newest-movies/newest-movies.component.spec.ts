import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewestMoviesComponent } from './newest-movies.component';

describe('NewestMoviesComponent', () => {
  let component: NewestMoviesComponent;
  let fixture: ComponentFixture<NewestMoviesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewestMoviesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewestMoviesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
