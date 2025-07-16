import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {

  email = signal('');
  newPassword = signal('');
  error = signal('');
  success = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  reset(): void {
    const user = this.auth.getUserByEmail(this.email());

    if (!user) {
      this.error.set('User not found!');
      this.success.set(false);
      return;
    }

    // Update password
    user.password = this.newPassword();

    try {
      // Save updated user
      localStorage.setItem(user.email, JSON.stringify(user));

      // If currently logged in, update current session too
      const current = this.auth.getUser();
      if (current?.email === user.email) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }

      this.success.set(true);
      this.error.set('');

      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error) {
      this.error.set('Failed to reset password.');
      this.success.set(false);
      console.error(error);
    }
  }

  onEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.email.set(input.value);
  }

  onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newPassword.set(input.value);
  }

}