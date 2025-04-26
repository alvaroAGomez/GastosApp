import { NgxCurrencyDirective } from 'ngx-currency';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CreditCardFormComponent } from '../credit-card-form.component';
import { CreateCreditCardDTO, CreditCard } from '../../../../models/card.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BancosService } from '../../../../services/bancos.service';
import { BancoDto } from '../../../../models/banco.model';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { CardService } from '../../../../services/card.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/confirm-dialog.component';

@Component({
  selector: 'app-credit-card-form-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyDirective,
  ],
  templateUrl: './credit-card-form-modal.component.html',
  styleUrl: './credit-card-form-modal.component.scss',
})
export class CreditCardFormModalComponent {
  cardForm: FormGroup;
  bancos: BancoDto[] = [];
  mode: 'create' | 'edit' = 'create';
  cards: CreditCard[] = [];
  selectedCardId: number | null = null;
  confirmUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreditCardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bancosService: BancosService,
    private cardService: CardService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {
    this.mode = data?.mode || 'create';
    this.cards = data?.cards || [];
    const cardData =
      data?.mode === 'edit' && data?.cards?.length ? data.cards[0] : data;

    // Normaliza fechas: si null o 1969-12-29 => null
    const normalizeDate = (date: any) => {
      if (!date) return null;
      // Puede venir como string o Date
      const d = typeof date === 'string' ? date.substring(0, 10) : '';
      if (d === '1969-12-29') return null;
      return date;
    };

    this.cardForm = this.fb.group({
      nombreTarjeta: [cardData?.nombreTarjeta || '', Validators.required],
      numeroTarjeta: [
        cardData?.numeroTarjeta ? cardData.numeroTarjeta.slice(-4) : '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^\d{4}$/),
        ],
      ],
      limiteCredito: [cardData?.limiteCredito || '', Validators.required],
      cierreCiclo: [normalizeDate(cardData?.cierreCiclo)],
      fechaVencimiento: [normalizeDate(cardData?.fechaVencimiento)],
      bancoId: [cardData?.banco?.id || '', Validators.required],
    });

    this.selectedCardId = cardData?.id || null;

    this.bancosService.getBancos().subscribe((bancos) => {
      this.bancos = bancos;
    });
  }

  onCardSelect(cardId: number) {
    const card = this.cards.find((c) => c.id === +cardId);
    if (card) {
      // Normaliza fechas: si null o 1969-12-29 => null
      const normalizeDate = (date: any) => {
        if (!date) return null;
        const d = typeof date === 'string' ? date.substring(0, 10) : '';
        if (d === '1969-12-29') return null;
        return date;
      };

      this.selectedCardId = card.id;
      this.cardForm.patchValue({
        nombreTarjeta: card.nombreTarjeta,
        numeroTarjeta: card.numeroTarjeta ? card.numeroTarjeta.slice(-4) : '',
        limiteCredito: card.limiteCredito,
        cierreCiclo: normalizeDate(card.cierreCiclo),
        fechaVencimiento: normalizeDate(card.fechaVencimiento),
        bancoId: card.banco?.id || '',
      });
    }
    this.confirmUpdate = false;
  }

  save() {
    if (this.cardForm.valid) {
      const formValue = {
        ...this.cardForm.value,
        limiteCredito: Number(this.cardForm.value.limiteCredito),
      };

      if (this.mode === 'edit' && this.selectedCardId) {
        const cardId = this.selectedCardId;
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Actualizar Tarjeta de Crédito',
            message: '¿Seguro que desea actualizar la tarjeta?',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            const dto = { ...formValue };
            this.cardService.updateCreditCard(cardId, dto).subscribe({
              next: (updatedCard) => {
                this.toast.success('Tarjeta actualizada exitosamente', 'Éxito');
                this.dialogRef.close(updatedCard);
              },
              error: (err) => {
                this.toast.error('Error al actualizar tarjeta', 'Error');
                this.confirmUpdate = false;
                console.error('Error al actualizar tarjeta', err);
              },
            });
          }
        });
      } else {
        const dto: CreateCreditCardDTO = formValue;
        this.cardService.createCreditCard(dto).subscribe({
          next: (createdCard) => {
            this.toast.success('Tarjeta creada exitosamente', 'Éxito');
            this.dialogRef.close(createdCard);
          },
          error: (err) => {
            this.toast.error('Error al crear tarjeta', 'Error');
            console.error('Error al crear tarjeta', err);
          },
        });
      }
    }
  }
}
