import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from './grid/grid.component';
import { NuevoGastoComponent } from '../nuevo-gasto/nuevo-gasto.component';

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

  NuevoGasto() {
    const dialogRef = this.dialog.open(NuevoGastoComponent, {
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created || result?.updated) {
        this.gridComponent.recargarDatos();
      }
    });
  }
}
