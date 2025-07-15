import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  username  = '';
  password = '';
  confirmPassword = '';
  email = '';
  success = false;
  showPassword = false;
  profileImage: string | ArrayBuffer | null = null;
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.username = user.username;
      this.email = user.email;
      this.profileImage = user.profileImage || null;
    }
  }

  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  save(): void {
    const storedUser = localStorage.getItem('auth_user');

    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    let user;
    try {
      user = JSON.parse(storedUser);
    } catch (e) {
      localStorage.removeItem('auth_user');
      this.router.navigate(['/login']);
      return;
    }

    if (!user || !user.email) {
      localStorage.removeItem('auth_user');
      this.router.navigate(['/login']);
      return;
    }

    // ვალიდაციები
    if (this.username.trim().length < 3) {
      this.errorMessage = 'Username must be at least 3 characters long.';
      return;
    }

    if (this.password && this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters.';
      return;
    }

    if (this.password && this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    const updated = {
      ...user,
      username: this.username.trim(),
      password: this.password || user.password,
      profileImage: this.profileImage || user.profileImage,
    };

    try {
      localStorage.setItem(user.email, JSON.stringify(updated));
      localStorage.setItem('auth_user', JSON.stringify(updated));
      this.success = true;
      this.errorMessage = '';

      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 1500);
    } catch (error) {
      this.errorMessage = 'Failed to save user data.';
      console.error('localStorage error:', error);
    }
  }

  goBack(): void {
    this.router.navigate(['/profile']);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}