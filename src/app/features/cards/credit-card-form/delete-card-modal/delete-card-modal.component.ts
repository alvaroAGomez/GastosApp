import { SpinnerService } from './../../../../shared/services/spinner.service';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../../services/card.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { CreditCard } from '../../../../models/card.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';

@Component({
  selector: 'app-delete-card-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './delete-card-modal.component.html',
  styleUrl: './delete-card-modal.component.scss',
})
export class DeleteCardModalComponent {
  selectedCardId: number | null = null;
  cards: CreditCard[] = [];
  confirmDelete: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteCardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cardService: CardService,
    private toast: ToastService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {
    this.cards = data?.cards || [];
  }

  askConfirm() {
    if (this.selectedCardId) {
      this.confirmDelete = true;
    }
  }

  deleteCard() {
    if (this.selectedCardId) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar Tarjeta de Crédito',
          message: '¿Seguro que desea eliminar la tarjeta?',
        },
      });
      const cardToDelete = this.selectedCardId;

      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          this.spinnerService.show();
          this.cardService.deleteCreditCard(cardToDelete).subscribe({
            next: () => {
              this.toast.success('Tarjeta eliminada exitosamente', 'Éxito');
              this.dialogRef.close({ deleted: true });
            },
            error: (err) => {
              this.toast.error('Error al eliminar tarjeta', 'Error');
              this.confirmDelete = false;
              this.spinnerService.hide();
            },
          });
        }
      });
    }
  }
}
