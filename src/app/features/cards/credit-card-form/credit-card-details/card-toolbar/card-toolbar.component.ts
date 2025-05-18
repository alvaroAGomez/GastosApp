import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MatButtonToggleModule,
  MatButtonToggleChange,
} from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-card-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
  ],
  templateUrl: './card-toolbar.component.html',
  styleUrls: ['./card-toolbar.component.scss'],
})
export class CardToolbarComponent {
  /** Si estamos en versión mobile */
  @Input() isMobile = false;
  /** Habilitar / deshabilitar botón "Ver cuotas pendientes" */
  @Input() hasPending = false;
  /** Modo actual: true=Charts, false=Table */
  @Input() showCharts = false;

  /** Dispara cuando el usuario presiona Nuevo Gasto */
  @Output() newExpense = new EventEmitter<void>();
  /** Dispara cuando el usuario presiona Ver cuotas pendientes */
  @Output() openPendings = new EventEmitter<void>();
  /** Dispara cuando el usuario cambia entre 'table' y 'charts' */
  @Output() viewChange = new EventEmitter<'table' | 'charts'>();

  onToggle(e: MatButtonToggleChange) {
    this.viewChange.emit(e.value);
  }
}
