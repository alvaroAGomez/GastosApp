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
import { ToastService } from '../../../../shared/services/toast.service';

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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreditCardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreditCard,
    private bancosService: BancosService,
    private cardService: CardService,
    private toast: ToastService
  ) {
    this.cardForm = this.fb.group({
      nombreTarjeta: [data?.nombreTarjeta || '', Validators.required],
      numeroTarjeta: [
        data?.numeroTarjeta ? data.numeroTarjeta.slice(-4) : '',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4),
          Validators.pattern(/^\d{4}$/),
        ],
      ],
      limiteCredito: [data?.limiteCredito || '', Validators.required],
      cierreCiclo: [data?.cierreCiclo || null],
      fechaVencimiento: [data?.fechaVencimiento || null],
      bancoId: [data?.banco?.id || '', Validators.required],
    });

    this.bancosService.getBancos().subscribe((bancos) => {
      this.bancos = bancos;
    });
  }

  save() {
    if (this.cardForm.valid) {
      const dto: CreateCreditCardDTO = this.cardForm.value;
      this.cardService.createCreditCard(dto).subscribe({
        next: (createdCard) => {
          // this.toast.success('Tarjeta creada exitosamente', 'Éxito');
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
