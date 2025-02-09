import { Component, inject, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent  implements OnInit{

  isMenuOpen = true; 
  // Observable que emite true cuando se detecta un dispositivo móvil
  isMobile: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    // Se detecta si el viewport coincide con Breakpoints.Handset
    this.isMobile = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }

  ngOnInit(): void {
    // Suscribirse al observable para actualizar el estado del menú
    this.isMobile.subscribe(isMobile => {
      // Si es móvil, forzamos que el menú se cierre
      if (isMobile) {
        this.isMenuOpen = false;
      }
    });
  }

  authService = inject(AuthService);
/*   breakpointObserver = inject(BreakpointObserver);

  isMenuOpen = true;
  isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches)); */

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get menuIcon() {
    return this.isMenuOpen ? 'chevron_left' : 'menu';
  }
}