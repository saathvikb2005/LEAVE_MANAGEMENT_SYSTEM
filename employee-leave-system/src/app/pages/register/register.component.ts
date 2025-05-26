import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  role = '';
  name = '';
  email = '';
  phone = '';
  department = '';
  managerId: number | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister(event: Event) {
    event.preventDefault();
    this.errorMessage = '';
    this.successMessage = '';

    // Determine role from managerId: if null, role = 'Manager'
    const finalRole = this.managerId === null ? 'Manager' : this.role;

    const user: User = {
      username: this.username,
      password: this.password,
      role: finalRole,
      name: this.name,
      email: this.email,
      phone: this.phone,
      department: this.department,
      manager: this.managerId ? { userId: this.managerId } : null, 
    };

    this.authService.register(user).subscribe({
      next: () => {
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Registration failed. Please check the details.';
      }
    });
  }
}
