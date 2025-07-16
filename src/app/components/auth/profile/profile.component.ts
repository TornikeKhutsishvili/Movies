import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { UiStateService } from '../../../services/ui-state.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  user: any;

  private ui = inject(UiStateService);

  constructor(private auth: AuthService, private router: Router) {
    // this.user = this.auth.getUser();
  }

  ngOnInit(): void {
    this.ui.setLoading(true);

    this.user = this.auth.getUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  goToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

}