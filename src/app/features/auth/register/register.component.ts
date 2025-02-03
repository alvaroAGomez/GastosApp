import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [
    CommonModule, // <-- Importar CommonModule
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatInputModule // <
  ],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatchValidator });

  onSubmit() {
    if (this.registerForm.valid) {
      // Usar type assertion y non-null operator
      const { name, email, password } = this.registerForm.value as {
        name: string;
        email: string;
        password: string;
      };
  
      this.authService.register({ 
        name: name!, 
        email: email!, 
        password: password! 
      }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (error) => console.error(error)
      });
    }
  }
}