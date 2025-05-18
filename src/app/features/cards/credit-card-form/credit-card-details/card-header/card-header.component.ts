import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';

export interface CreditCardDetailHeader {
  tarjetaId: number;
  nombreTarjeta: string;
  banco?: string;
  limiteTotal: number;
  gastoActualMensual: number;
  totalConsumosPendientes: number;
  limiteDisponible: number;
}

interface LimitItem {
  label: string;
  value: number;
  cssClass?: string;
}

@Component({
  selector: 'app-card-header',
  standalone: true,
  imports: [CommonModule, CustomCurrencyPipe],
  templateUrl: './card-header.component.html',
  styleUrls: ['./card-header.component.scss'],
})
export class CardHeaderComponent {
  @Input() cardHeaderDetail!: CreditCardDetailHeader;

  get limitItems(): LimitItem[] {
    const d = this.cardHeaderDetail;
    return [
      { label: 'Límite Total', value: d.limiteTotal, cssClass: 'limit-total' },
      {
        label: 'Gasto Actual Mes',
        value: d.gastoActualMensual,
        cssClass: 'limit-red',
      },
      {
        label: 'Gastos Pendientes',
        value: d.totalConsumosPendientes,
        cssClass: 'limit-orange',
      },
      {
        label: 'Límite Disponible',
        value: d.limiteDisponible,
        cssClass: this.getLimitColorClass(d),
      },
    ];
  }

  private getLimitColorClass(h: CreditCardDetailHeader): string {
    const pct =
      h.limiteTotal > 0 ? (h.limiteDisponible / h.limiteTotal) * 100 : 0;
    if (pct <= 15) return 'limit-red';
    if (pct <= 55) return 'limit-orange';
    return 'limit-green';
  }
}
