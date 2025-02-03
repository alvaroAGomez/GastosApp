import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [
    CommonModule, // <-- Agregar este import
    RouterOutlet,
    RouterLink,
    MatButtonModule,
    NgIf,         // <-- Directiva necesaria
    AsyncPipe,    // <-- Para el pipe async
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gastosApp';
  authService = inject(AuthService);
}
