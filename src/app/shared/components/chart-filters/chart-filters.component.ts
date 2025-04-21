import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-chart-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatOptionModule,
  ],
  template: `
    <form [formGroup]="filterForm" class="filter-form" (ngSubmit)="onSearch()">
      <ng-container *ngIf="showDateRange">
        <mat-form-field>
          <mat-label>Desde</mat-label>
          <input
            matInput
            [matDatepicker]="picker1"
            formControlName="fechaDesde"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker1"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker1></mat-datepicker>
        </mat-form-field>
        <mat-form-field>
          <mat-label>Hasta</mat-label>
          <input
            matInput
            [matDatepicker]="picker2"
            formControlName="fechaHasta"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker2"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker2></mat-datepicker>
        </mat-form-field>
      </ng-container>
      <ng-container *ngIf="showCategoria">
        <mat-form-field>
          <mat-label>Categoría</mat-label>
          <mat-select formControlName="categoria">
            <mat-option value="">Todas</mat-option>
            <mat-option *ngFor="let cat of categorias" [value]="cat.id">{{
              cat.nombre
            }}</mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>
      <ng-container *ngIf="showTarjeta">
        <mat-form-field>
          <mat-label>Tarjeta</mat-label>
          <mat-select formControlName="tarjeta">
            <mat-option value="">Todas</mat-option>
            <mat-option *ngFor="let t of tarjetas" [value]="t.id">{{
              t.nombre
            }}</mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>
      <ng-container *ngIf="showAgrupacion">
        <mat-form-field>
          <mat-label>Agrupar por</mat-label>
          <mat-select formControlName="agrupacion">
            <mat-option value="mes">Mes</mat-option>
            <mat-option value="categoria">Categoría</mat-option>
            <mat-option value="anio">Año</mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>
      <ng-container *ngIf="showChartType">
        <mat-form-field>
          <mat-label>Tipo de gráfico</mat-label>
          <mat-select formControlName="chartType">
            <mat-option *ngFor="let type of allowedCharts" [value]="type">{{
              type
            }}</mat-option>
          </mat-select>
        </mat-form-field>
      </ng-container>
      <button mat-raised-button color="primary" type="submit">Buscar</button>
    </form>
  `,
  //styleUrls: ['./chart-filters.component.scss'],
})
export class ChartFiltersComponent {
  @Input() categorias: { id: number; nombre: string }[] = [];
  @Input() tarjetas: { id: number; nombre: string }[] = [];
  @Input() allowedCharts: string[] = [
    'line',
    'bar',
    'pie',
    'radar',
    'groupedBar',
    'doughnut',
  ];
  @Input() showDateRange = true;
  @Input() showCategoria = true;
  @Input() showTarjeta = true;
  @Input() showAgrupacion = true;
  @Input() showChartType = true;
  @Input() initialFilters: any = {};

  @Output() filtersChange = new EventEmitter<any>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      fechaDesde: [null],
      fechaHasta: [null],
      categoria: [''],
      tarjeta: [''],
      agrupacion: ['mes'],
      chartType: ['line'],
    });
  }

  ngOnInit() {
    if (this.initialFilters) {
      this.filterForm.patchValue(this.initialFilters, { emitEvent: false });
    }
  }

  onSearch() {
    this.filtersChange.emit(this.filterForm.value);
  }
}
