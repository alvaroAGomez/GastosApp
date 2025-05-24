import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordMatchValidator } from '../../../shared/validators/password-match.validator';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatInputModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  breakpointObserver = inject(BreakpointObserver);
  isMobile = false;

  registerForm = this.fb.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          ),
        ],
      ],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });

    // Forzar validación de passwordMismatch al cambiar confirmPassword
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity({
        onlySelf: false,
        emitEvent: false,
      });
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { nombre, email, password } = this.registerForm.value as {
        nombre: string;
        email: string;
        password: string;
      };

      this.authService
        .register({
          nombre: nombre!,
          email: email!,
          password: password!,
        })
        .subscribe({
          next: () => this.router.navigate(['/login']),
          error: (error) => {
            this.toast.error(
              error?.error?.message ||
                'Error al registrar. Verifica los datos ingresados.'
            );
          },
        });
    }
  }
}
