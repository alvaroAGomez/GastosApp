import {
  Component,
  inject,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { CardService } from '../../services/card.service';
import { MatExpansionModule } from '@angular/material/expansion';

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
    RouterModule,
    MatExpansionModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements AfterViewInit {
  @ViewChild('drawer') drawer!: MatSidenav;
  isSidenavOpen = false;

  isMobile$: Observable<boolean>;
  authService = inject(AuthService);
  creditCards$: Observable<any[]>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private creditCardService: CardService
  ) {
    this.creditCards$ = this.creditCardService.getCards();

    this.isMobile$ = this.breakpointObserver
      .observe([Breakpoints.Handset])
      .pipe(
        map((result) => result.matches),
        shareReplay()
      );
  }

  ngAfterViewInit() {
    this.isMobile$.subscribe((isMobile) => {
      setTimeout(() => {
        this.isSidenavOpen = !isMobile;
        if (isMobile && this.drawer.opened) {
          this.drawer.close();
        }
        if (!isMobile && !this.drawer.opened) {
          this.drawer.open();
        }
        this.cdr.detectChanges();
      });
    });
  }

  toggleMenu() {
    this.drawer.toggle();
  }

  closeMenuIfMobile() {
    // Usar BreakpointObserver para obtener el valor actual sincrónicamente
    if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
      this.drawer.close();
    }
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cerrar Sesión',
        message: '¿Seguro que desea cerrar sesión?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
}
