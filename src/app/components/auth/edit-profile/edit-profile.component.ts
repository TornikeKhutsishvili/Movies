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

  name = '';
  password = '';
  confirmPassword = '';
  email = '';
  success = false;
  showPassword = false;
  profileImage: string | ArrayBuffer | null = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.name = user.name;
      this.email = user.email;
    }
  }

  onPhotoSelected(event: any) {
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
      alert('User not found in localStorage.');
      this.router.navigate(['/login']);
      return;
    }

    let user;
    try {
      // Check if the stored user data is valid JSON
      user = JSON.parse(storedUser);
    } catch (e) {
      alert('Invalid user data in localStorage.');
      localStorage.removeItem('auth_user');
      this.router.navigate(['/login']);
      return;
    }

    // Validate that the data contains the necessary fields
    if (!user || !user.email) {
      alert('Invalid user data in localStorage. Missing email.');
      localStorage.removeItem('auth_user');
      this.router.navigate(['/login']);
      return;
    }
  // Extra manual validation
    if (this.name.trim().length < 3) {
      alert('Name must be at least 3 characters long.');
      return;
    }

    if (this.password && this.password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (this.password && this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Update user object
    const updated = {
      ...user,
      name: this.name.trim(),
      password: this.password || user.password, // Only update password if provided
    };

    try {
      // Save the updated user data back to localStorage
      localStorage.setItem(user.email, JSON.stringify(updated));
      localStorage.setItem('auth_user', JSON.stringify(updated));
      this.success = true;

      setTimeout(() => {
        this.router.navigate(['/profile']);
      }, 1500);
    } catch (error) {
      alert('Failed to save user data.');
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
