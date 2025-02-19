import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ArcElement, Chart, ChartConfiguration, ChartData, ChartType, Title } from 'chart.js';
import { Expense } from '../../../models/expense.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective, NgChartsConfiguration } from 'ng2-charts'; 

Chart.register(ArcElement, Title);

@Component({
  selector: 'app-dynamic-charts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    BaseChartDirective
  ],
  templateUrl: './dynamic-charts.component.html',
  styleUrls: ['./dynamic-charts.component.scss']
})
export class DynamicChartsComponent implements OnInit {
  filterForm: FormGroup;
  // Suponiendo que estas son las categorías disponibles (puedes cargarlas desde un servicio)
  categories: string[] = ['Alimentos', 'Transporte', 'Entretenimiento', 'Tecnología', 'Salud'];

  // Supón que tienes un array de gastos (Expense[]) obtenido desde un servicio o similar.
  // Aquí se usa datos de ejemplo.
  expenses: Expense[] = [
    {
      id: 1,
      amount: 250,
      date: new Date('2023-03-05'),
      description: 'Compra supermercado',
      category: 'Alimentos',
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    {
      id: 2,
      amount: 120,
      date: new Date('2023-03-10'),
      description: 'Taxi',
      category: 'Transporte',
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    {
      id: 3,
      amount: 450,
      date: new Date('2023-03-15'),
      description: 'Cena en restaurante',
      category: 'Entretenimiento',
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    // ... más gastos
  ];

  // Configuración del gráfico de torta (pie)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: { legend: { display: true, position: 'top' } }
  };
  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';

  // Configuración del gráfico de barras
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };
  public barChartLabels: string[] = [];
  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: []
  };
  public barChartType: ChartType = 'bar';

  // Configuración del gráfico de tendencia (línea)
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };
  public lineChartLabels: string[] = [];
  public lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: []
  };
  public lineChartType: ChartType = 'line';

  constructor(private fb: FormBuilder) {
    // Filtros:
    // - timeFilter: 'month' (mes actual) o 'year' (año completo)
    // - selectedMonth: número (1-12)
    // - selectedYear: año en números
    // - category: cadena vacía (todas) o nombre de categoría
    this.filterForm = this.fb.group({
      timeFilter: ['month'],
      selectedMonth: [new Date().getMonth() + 1],
      selectedYear: [new Date().getFullYear()],
      category: ['']
    });
  }

  ngOnInit(): void {
    // Actualizamos los gráficos con los filtros iniciales
    this.updateCharts();
    // Cuando cambie algún filtro, actualizamos los gráficos
    this.filterForm.valueChanges.subscribe(() => {
      this.updateCharts();
    });
  }

  updateCharts(): void {
    const { timeFilter, selectedMonth, selectedYear, category } = this.filterForm.value;

    // Filtrar gastos por tiempo (mes o año) y categoría
    let filteredExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const matchYear = expDate.getFullYear() === selectedYear;
      if (timeFilter === 'month') {
        return expDate.getMonth() + 1 === selectedMonth && matchYear;
      }
      return matchYear;
    });

    if (category) {
      filteredExpenses = filteredExpenses.filter(exp => exp.category === category);
    }

    // Agregación por categoría para pie y barras
    const categoryMap: { [key: string]: number } = {};
    filteredExpenses.forEach(exp => {
      const cat = typeof exp.category === 'string' ? exp.category : (exp.category as any).name;
      categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
    });
    this.pieChartLabels = Object.keys(categoryMap);
    this.pieChartData.datasets[0].data = Object.values(categoryMap);
    this.barChartLabels = Object.keys(categoryMap);
    this.barChartData.datasets = [{
      data: Object.values(categoryMap),
      label: 'Gastos por Categoría'
    }];

    // Tendencia: si es mes, agrupar por día; si es año, agrupar por mes.
    if (timeFilter === 'month') {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dailyTotals = new Array(daysInMonth).fill(0);
      filteredExpenses.forEach(exp => {
        const day = new Date(exp.date).getDate();
        dailyTotals[day - 1] += exp.amount;
      });
      this.lineChartLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      this.lineChartData.datasets = [{
        data: dailyTotals,
        label: 'Gastos Diarios'
      }];
    } else {
      const monthlyTotals = new Array(12).fill(0);
      filteredExpenses.forEach(exp => {
        const month = new Date(exp.date).getMonth(); // 0-indexed
        monthlyTotals[month] += exp.amount;
      });
      this.lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                                'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      this.lineChartData.datasets = [{
        data: monthlyTotals,
        label: 'Gastos Mensuales'
      }];
    }
  }
}
