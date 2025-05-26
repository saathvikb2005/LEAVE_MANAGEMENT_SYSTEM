import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User | null = null;
  loading = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    if (currentUser?.userId) {
      this.loadUser(currentUser.userId);
    } else {
      this.errorMsg = 'User not found. Please log in again.';
    }
  }

  loadUser(userId: number) {
    this.loading = true;
    this.userService.getUserById(userId).subscribe({
      next: user => {
        this.user = user;
        this.loading = false;
      },
      error: err => {
        this.errorMsg = 'Failed to load user profile';
        this.loading = false;
      }
    });
  }

  updateUserProfile() {
    if (this.user && this.user.userId) {
      this.loading = true;
      // just send the user as is
      this.userService.updateUser(this.user.userId, this.user).subscribe({
        next: updatedUser => {
          this.user = updatedUser;
          this.loading = false;
          alert('Profile updated successfully!');
        },
        error: err => {
          console.error('Update profile error:', err);
          this.errorMsg = 'Failed to update profile';
          this.loading = false;
        }
      });
    }
  }

}
