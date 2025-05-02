import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-pending-installments-modal',
  standalone: true,
  imports: [
    CommonModule,
    CustomCurrencyPipe,
    MatTableModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: './pending-installments-modal.component.html',
  styleUrls: ['./pending-installments-modal.component.scss'],
})
export class PendingInstallmentsModalComponent {
  isMobile: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<PendingInstallmentsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      movimientos: any[];
      totalCuotasPendientes: number;
      displayedColumns: string[];
    },
    private breakpointObserver: BreakpointObserver
  ) {
    // Detectar si está en mobile
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
  }
}
