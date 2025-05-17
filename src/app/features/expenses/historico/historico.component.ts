import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from '../grid/grid.component';
import { UpcomingExpensesComponent } from '../upcoming-expenses/upcoming-expenses.component';

@Component({
  selector: 'app-historico',
  imports: [
    CommonModule,
    GridComponent,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss',
  standalone: true,
})
export class HistoricoComponent {
  @ViewChild('grid') gridComponent!: GridComponent;
  constructor(private dialog: MatDialog) {}

  onNewExpense() {
    const dialogRef = this.dialog.open(UpcomingExpensesComponent, {
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created || result?.updated) {
        this.gridComponent.reloadData();
      }
    });
  }
}
