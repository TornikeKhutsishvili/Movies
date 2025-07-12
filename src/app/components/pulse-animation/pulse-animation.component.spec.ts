import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PulseAnimationComponent } from './pulse-animation.component';

describe('PulseAnimationComponent', () => {
  let component: PulseAnimationComponent;
  let fixture: ComponentFixture<PulseAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PulseAnimationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PulseAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
