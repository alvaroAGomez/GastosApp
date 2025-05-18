import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { GastoMensual } from '../../interfaces';

@Component({
  selector: 'app-expense-list-mobile',
  standalone: true,
  imports: [CommonModule, CustomCurrencyPipe, MatIconModule],
  templateUrl: './expense-list-mobile.component.html',
  styleUrls: ['./expense-list-mobile.component.scss'],
})
export class ExpenseListMobileComponent {
  @Input() data: GastoMensual[] = [];
  @Output() edit = new EventEmitter<GastoMensual>();
  @Output() delete = new EventEmitter<GastoMensual>();
}
