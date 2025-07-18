import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  username = signal('');
  password = signal('');
  confirmPassword = signal('');
  email = signal('');
  success = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  usernameValue = '';
  passwordValue = '';
  confirmPasswordValue = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.username.set(user.username ?? '');
      this.email.set(user.email ?? '');

      this.usernameValue = this.username();
      this.passwordValue = '';
      this.confirmPasswordValue = '';
    }
  }

  save(): void {
    if (this.usernameValue.trim().length < 3) {
      this.errorMessage.set('Username must be at least 3 characters long.');
      return;
    }
    if (this.passwordValue && this.passwordValue.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }
    if (this.passwordValue && this.passwordValue !== this.confirmPasswordValue) {
      this.errorMessage.set('Passwords do not match!');
      return;
    }

    const storedUser = localStorage.getItem('auth_user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem('auth_user');
      this.router.navigate(['/login']);
      return;
    }

    if (!user || !user.email) {
      localStorage.removeItem('auth_user');
      this.router.navigate(['/login']);
      return;
    }

    // დავაყენოთ Signal-ებში ბოლო ვალები
    this.username.set(this.usernameValue.trim());
    this.password.set(this.passwordValue || user.password);

    const updated = {
      ...user,
      username: this.username(),
      password: this.password(),
    };

    try {
      localStorage.setItem(user.email, JSON.stringify(updated));
      localStorage.setItem('auth_user', JSON.stringify(updated));
      this.success.set(true);
      this.errorMessage.set('');

      setTimeout(() => this.router.navigate(['/profile']), 1500);
    } catch (error) {
      this.errorMessage.set('Failed to save user data.');
      console.error(error);
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  togglePassword(): void {
    this.showPassword.set(!this.showPassword());
  }

}