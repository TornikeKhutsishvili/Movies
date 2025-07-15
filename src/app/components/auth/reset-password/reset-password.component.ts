import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

  email = '';
  newPassword = '';
  error = '';
  success = false;

  constructor(private auth: AuthService, private router: Router) {}

  reset(): void {
    const user = this.auth.getUserByEmail(this.email);
    if (!user) {
      this.error = 'User not found!';
      return;
    }

    // Update password
    user.password = this.newPassword;

    try {
      // Save updated user
      localStorage.setItem(user.email, JSON.stringify(user));

      // If currently logged in, update current session too
      const current = this.auth.getUser();
      if (current?.email === user.email) {
        localStorage.setItem('auth_user', JSON.stringify(user));
      }

      this.success = true;

      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (error) {
      this.error = 'Failed to reset password.';
      console.error(error);
    }
  }

}
