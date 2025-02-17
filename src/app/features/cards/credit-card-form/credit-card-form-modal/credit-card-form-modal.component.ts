import { NgxCurrencyDirective } from 'ngx-currency';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreditCardFormComponent } from '../credit-card-form.component';
import { Card } from '../../../../models/card.model';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-credit-card-form-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxCurrencyDirective    
  ],
  templateUrl: './credit-card-form-modal.component.html',
  styleUrl: './credit-card-form-modal.component.scss'
})
export class CreditCardFormModalComponent {
  cardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CreditCardFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {
    this.cardForm = this.fb.group({
      name: [data?.name || '', Validators.required],
      type: [data?.type || '', Validators.required],
      creditLimit: [data?.creditLimit || ''],
      closingDay: [data?.closingDay || ''],
      dueDay: [data?.dueDay || '']
    });
  }

  save() {
    if (this.cardForm.valid) {
      this.dialogRef.close(this.cardForm.value);
    }
  }
}

