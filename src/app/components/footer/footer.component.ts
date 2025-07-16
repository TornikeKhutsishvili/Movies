import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UiStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  currentYear = signal<number>(new Date().getFullYear());

  private ui = inject(UiStateService);

  ngOnInit() {
    this.ui.setLoading(true);
  }

}