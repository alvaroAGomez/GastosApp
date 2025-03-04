import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { 
  ArcElement, 
  CategoryScale, 
  LinearScale, 
  PieController, 
  BarController, 
  LineController, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  ChartConfiguration,
  ChartData,
  ChartType,
  Chart, 
  BarElement
} from 'chart.js';
import { Expense } from '../../../models/expense.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BaseChartDirective } from 'ng2-charts';
import { ExpenseService } from '../../../services/expense.service';

// Registrar los elementos necesarios para todos los gráficos
Chart.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PieController,
  BarController,
  LineController,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

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
  // Categorías de ejemplo
  categories: string[] = ['Alimentos', 'Transporte', 'Entretenimiento', 'Tecnología', 'Salud'];

  // Datos de gastos de ejemplo (fechas en 2025)
  expenses: Expense[] = [
    {
      id: 1,
      amount: 250,
      date: new Date('2025-03-05'),
      description: 'Compra supermercado',
      category: 'Alimentos',
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    {
      id: 2,
      amount: 120,
      date: new Date('2025-03-10'),
      description: 'Taxi',
      category: 'Transporte',
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    {
      id: 3,
      amount: 450,
      date: new Date('2025-03-15'),
      description: 'Cena en restaurante',
      category: 'Entretenimiento',
      cardId: '1234',
      nameCard: 'Visa Gold'
    }
  ];

   colors = [
    'rgba(255, 99, 132, 0.6)', 
    'rgba(54, 162, 235, 0.6)', 
    'rgba(255, 206, 86, 0.6)', 
    'rgba(75, 192, 192, 0.6)', 
    'rgba(153, 102, 255, 0.6)', 
    'rgba(255, 159, 64, 0.6)', 
    'rgba(201, 99, 255, 0.6)', 
    'rgba(255, 105, 180, 0.6)', 
    'rgba(0, 255, 127, 0.6)', 
    'rgba(255, 140, 0, 0.6)', 
    'rgba(0, 191, 255, 0.6)', 
    'rgba(34, 139, 34, 0.6)', 
    'rgba(255, 165, 0, 0.6)', 
    'rgba(240, 128, 128, 0.6)', 
    'rgba(50, 205, 50, 0.6)', 
    'rgba(255, 69, 0, 0.6)', 
    'rgba(255, 105, 180, 0.6)', 
    'rgba(0, 206, 209, 0.6)', 
    'rgba(255, 20, 147, 0.6)'
  ];

  // Configuración del gráfico de torta (pie)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right' // Mueve la leyenda al costado
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const dataset = tooltipItem.dataset;
            const total = dataset.data.reduce((sum: number, value: number) => sum + value, 0);
            const value = dataset.data[tooltipItem.dataIndex];
            const percentage = ((value / total) * 100).toFixed(1);
            return `$${value} (${percentage}%)`;
          }
        }
      }
    }
  };



  public pieChartLabels: string[] = [];
  public pieChartData: ChartData<'pie'> = {
    labels: this.pieChartLabels,
    datasets: [{ data: [], backgroundColor: [] }]
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

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) {
    // Inicializar filtros con valores que coincidan con los datos (fechas 2025)
    this.filterForm = this.fb.group({
      timeFilter: ['month'], // "month" o "year"
      selectedMonth: [new Date('2025-03-05').getMonth() + 1], // 3
      selectedYear: [2025],
      category: ['']
    });

    
  }

  ngOnInit(): void {
    this.expenseService.getExpensesTC().subscribe(data => {
      this.expenses = data;
      this.updateCharts();
    })
    // Actualiza los gráficos cada vez que se modifiquen los filtros
    this.filterForm.valueChanges.subscribe(() => {
      this.updateCharts();
    });
  }

  updateCharts(): void {
    const { timeFilter, selectedMonth, selectedYear, category } = this.filterForm.value;
    console.log("Filtros:", { timeFilter, selectedMonth, selectedYear, category });

    // Filtrar gastos por año y, si corresponde, por mes
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
      console.log("Filtrado por categoría:", filteredExpenses);
    }

    // Agregación para gráficos de torta y barras por categoría
    const categoryMap: { [key: string]: number } = {};
    filteredExpenses.forEach(exp => {
      const cat = typeof exp.category === 'string' ? exp.category : (exp.category as any).name;
      categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
    });
    const labels = Object.keys(categoryMap);
    const dataValues = Object.values(categoryMap);
    const pieColors = this.colors;

    // Reasignar datos del gráfico de torta
    this.pieChartLabels = labels;
    this.pieChartData = {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: pieColors.slice(0, labels.length)
      }]
    };

    // Gráfico de barras
    this.barChartLabels = labels;
    this.barChartData = {
      labels: labels,
      datasets: [{
        data: dataValues,
        label: 'Gastos por Categoría',
        backgroundColor: pieColors.slice(0, labels.length),//'rgba(75, 192, 192, 0.6)',
        borderColor: pieColors.slice(0, labels.length), //'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };

    // Gráfico de tendencia (línea)
    if (timeFilter === 'month') {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dailyTotals = new Array(daysInMonth).fill(0);
      filteredExpenses.forEach(exp => {
        const day = new Date(exp.date).getDate();
        dailyTotals[day - 1] += exp.amount;
      });
      const dayLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      this.lineChartLabels = dayLabels;
      this.lineChartData = {
        labels: dayLabels,
        datasets: [{
          data: dailyTotals,
          label: 'Gastos Diarios',
          fill: false,
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          tension: 0.4
        }]
      };
    } else {
      const monthlyTotals = new Array(12).fill(0);
      filteredExpenses.forEach(exp => {
        const month = new Date(exp.date).getMonth(); // 0-indexed
        monthlyTotals[month] += exp.amount;
      });
      const monthLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                           'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      this.lineChartLabels = monthLabels;
      this.lineChartData = {
        labels: monthLabels,
        datasets: [{
          data: monthlyTotals,
          label: 'Gastos Mensuales',
          fill: false,
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
          tension: 0.4
        }]
      };
    }
  }
}
