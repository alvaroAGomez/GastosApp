import { Component, inject } from '@angular/core';
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
export class MainLayoutComponent {
  authService = inject(AuthService);
  breakpointObserver = inject(BreakpointObserver);

  isMenuOpen = true;
  isMobile = this.breakpointObserver.observe([Breakpoints.Handset])
    .pipe(map(result => result.matches));

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get menuIcon() {
    return this.isMenuOpen ? 'chevron_left' : 'menu';
  }
}