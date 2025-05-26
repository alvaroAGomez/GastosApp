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
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { SpinnerService } from '../../../../shared/services/spinner.service';

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
  cardForm!: FormGroup;
  bancos: BancoDto[] = [];
  cards: CreditCard[] = [];
  mode: 'create' | 'edit' = 'create';
  selectedCardId: number | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreditCardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bancosService: BancosService,
    private cardService: CardService,
    private toast: ToastrService,
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {
    this.mode = data?.mode || 'create';
    this.cards = data?.cards || [];

    this.buildForm(this.getInitialCardData());
    this.loadBancos();
  }

  private getInitialCardData(): Partial<CreditCard> {
    if (this.mode === 'edit' && this.cards.length) {
      return this.cards[0];
    }
    return this.data || {};
  }

  private normalizeDate(date: any): Date | null {
    if (!date) return null;
    const value = typeof date === 'string' ? date.substring(0, 10) : '';
    return value === '1969-12-29' ? null : new Date(date);
  }

  private buildForm(card: Partial<CreditCard>) {
    this.cardForm = this.fb.group({
      nombreTarjeta: [card.nombreTarjeta || '', Validators.required],
      numeroTarjeta: [
        card.numeroTarjeta ? card.numeroTarjeta.slice(-4) : '',
        [Validators.required, Validators.pattern(/^\d{4}$/)],
      ],
      limiteCredito: [card.limiteCredito || '', Validators.required],
      cierreCiclo: [this.normalizeDate(card.cierreCiclo)],
      fechaVencimiento: [this.normalizeDate(card.fechaVencimiento)],
      bancoId: [card.banco?.id || '', Validators.required],
    });

    this.selectedCardId = card.id || null;
  }

  private loadBancos() {
    this.bancosService.getBancos().subscribe((b) => (this.bancos = b));
  }

  onCardSelect(cardId: number) {
    const card = this.cards.find((c) => c.id === +cardId);
    if (card) {
      this.selectedCardId = card.id;
      this.cardForm.patchValue({
        nombreTarjeta: card.nombreTarjeta,
        numeroTarjeta: card.numeroTarjeta?.slice(-4) || '',
        limiteCredito: card.limiteCredito,
        cierreCiclo: this.normalizeDate(card.cierreCiclo),
        fechaVencimiento: this.normalizeDate(card.fechaVencimiento),
        bancoId: card.banco?.id || '',
      });
    }
  }

  save() {
    if (this.cardForm.invalid) return;

    const dto = {
      ...this.cardForm.value,
      limiteCredito: Number(this.cardForm.value.limiteCredito),
    };

    this.mode === 'edit' && this.selectedCardId
      ? this.confirmAndUpdate(dto)
      : this.createCard(dto);
  }

  private confirmAndUpdate(dto: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Actualizar Tarjeta de Crédito',
          message: '¿Seguro que desea actualizar la tarjeta?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.spinnerService.show();
          this.cardService
            .updateCreditCard(this.selectedCardId!, dto)
            .subscribe({
              next: (updatedCard) => {
                this.toast.success('Tarjeta actualizada exitosamente', 'Éxito');
                this.dialogRef.close({ updated: true, card: updatedCard });
              },
              error: () => {
                this.toast.error('Error al actualizar tarjeta', 'Error');
                this.spinnerService.hide();
              },
            });
        }
      });
  }

  private createCard(dto: CreateCreditCardDTO) {
    this.spinnerService.show();
    this.cardService.createCreditCard(dto).subscribe({
      next: (createdCard) => {
        this.toast.success('Tarjeta creada exitosamente', 'Éxito');
        this.dialogRef.close({ created: true, card: createdCard });
      },
      error: () => {
        this.toast.error('Error al crear tarjeta', 'Error');
        this.spinnerService.hide();
      },
    });
  }
}
