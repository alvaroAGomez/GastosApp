import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-pending-installments-modal',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    CustomCurrencyPipe,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './pending-installments-modal.component.html',
  styleUrls: ['./pending-installments-modal.component.scss'],
})
export class PendingInstallmentsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<PendingInstallmentsModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      movimientos: any[];
      totalCuotasPendientes: number;
      displayedColumns: string[];
    }
  ) {}
}
