import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CardService } from '../../../services/card.service';
import { Card, CardType } from '../../../models/card.model';

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [/* ReactiveFormsModule y componentes de UI */],
  templateUrl: './credit-card-form.component.html'
})
export class CreditCardFormComponent {
  private fb = inject(FormBuilder);
  private cardService = inject(CardService);

  cardForm = this.fb.group({
    name: ['', Validators.required],
    creditLimit: [null, [Validators.required, Validators.min(1)]],
    closingDay: [null, [Validators.min(1), Validators.max(31)]],
    dueDay: [null, [Validators.min(1), Validators.max(31)]],
    // Agregar campos requeridos
    type: this.fb.control<CardType>('credit', { nonNullable: true }),
    balance: [0, Validators.required]
  });

  onSubmit() {
    if (this.cardForm.valid) {
      const cardData = {
        ...this.cardForm.value,
        expenses: [] // Inicializar array vacío
      } as Omit<Card, 'id'>;
      
      this.cardService.createCreditCard(cardData).subscribe();
    }
  }
}