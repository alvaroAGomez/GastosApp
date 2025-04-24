import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title || 'Confirmar' }}</h2>
    <mat-dialog-content>
      <p>{{ data.message || '¿Está seguro?' }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button
        mat-raised-button
        color="primary"
        class="custom-button-cancelar"
        mat-dialog-close="false"
        [ngStyle]="{
          border: 'none',
          'border-radius': '25px',
          height: '40px',

          cursor: 'pointer'
        }"
      >
        Cancelar
      </button>
      <button
        mat-raised-button
        color="primary"
        class="custom-button"
        [mat-dialog-close]="true"
        [ngStyle]="{
          border: 'none',
          'border-radius': '25px',
          height: '40px',
          cursor: 'pointer'
        }"
      >
        Confirmar
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, CommonModule],
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
  ) {}
}
