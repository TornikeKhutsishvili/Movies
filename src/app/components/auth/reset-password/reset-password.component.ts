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

  reset() {
    const user = this.auth.getUserByEmail(this.email);
    if (!user) {
      this.error = 'User not found!';
      return;
    }

    // update password
    user.password = this.newPassword;

    // The password will be deleted from the temporarily stored data
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(user.email, JSON.stringify(userWithoutPassword));

    this.success = true;

    setTimeout(() => this.router.navigate(['/login']), 2000);
  }

}
