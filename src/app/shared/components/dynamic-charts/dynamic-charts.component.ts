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
  expenses: Expense[] = [];

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

  public months = [
    { value: 1, name: 'Enero' },
    { value: 2, name: 'Febrero' },
    { value: 3, name: 'Marzo' },
    { value: 4, name: 'Abril' },
    { value: 5, name: 'Mayo' },
    { value: 6, name: 'Junio' },
    { value: 7, name: 'Julio' },
    { value: 8, name: 'Agosto' },
    { value: 9, name: 'Septiembre' },
    { value: 10, name: 'Octubre' },
    { value: 11, name: 'Noviembre' },
    { value: 12, name: 'Diciembre' }
  ];
  


  // Configuración del gráfico de torta (pie)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right'
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
      timeFilter: ['month'],
      selectedMonth: [new Date('2025-03-05').getMonth() + 1], 
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

    let filteredExpenses = this.getFilteredExpenses(timeFilter, selectedMonth, selectedYear, category);
    const { labels, dataValues } = this.aggregateExpensesByCategory(filteredExpenses);

    this.updatePieChart(labels, dataValues);
    this.updateBarChart(labels, dataValues);
    this.updateLineChart(timeFilter, selectedMonth, selectedYear, filteredExpenses);
  }

  private getFilteredExpenses(timeFilter: string, selectedMonth: number, selectedYear: number, category?: string): any[] {
    let filteredExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.date);
      const matchYear = expDate.getFullYear() === selectedYear;
      return timeFilter === 'month' ? expDate.getMonth() + 1 === selectedMonth && matchYear : matchYear;
    });

    if (category) {
      filteredExpenses = filteredExpenses.filter(exp => exp.category === category);
    }
    return filteredExpenses;
  }

  private aggregateExpensesByCategory(expenses: any[]): { labels: string[], dataValues: number[] } {
    const categoryMap: { [key: string]: number } = {};
    expenses.forEach(exp => {
      const cat = typeof exp.category === 'string' ? exp.category : (exp.category as any).name;
      categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
    });
    return { labels: Object.keys(categoryMap), dataValues: Object.values(categoryMap) };
  }

  private updatePieChart(labels: string[], dataValues: number[]): void {
    this.pieChartLabels = labels;
    this.pieChartData = {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: this.colors.slice(0, labels.length)
      }]
    };
  }

  private updateBarChart(labels: string[], dataValues: number[]): void {
    this.barChartLabels = labels;
    this.barChartData = {
      labels: labels,
      datasets: [{
        data: dataValues,
        label: 'Gastos por Categoría',
        backgroundColor: this.colors.slice(0, labels.length),
        borderColor: this.colors.slice(0, labels.length),
        borderWidth: 1
      }]
    };
  }

  private updateLineChart(timeFilter: string, selectedMonth: number, selectedYear: number, filteredExpenses: any[]): void {
    if (timeFilter === 'month') {
      const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
      const dailyTotals = new Array(daysInMonth).fill(0);
      filteredExpenses.forEach(exp => {
        const day = new Date(exp.date).getDate();
        dailyTotals[day - 1] += exp.amount;
      });
      this.lineChartLabels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
      this.lineChartData = this.createLineChartData(dailyTotals, 'Gastos Diarios', 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.6)');
    } else {
      const monthlyTotals = new Array(12).fill(0);
      filteredExpenses.forEach(exp => {
        const month = new Date(exp.date).getMonth(); 
        monthlyTotals[month] += exp.amount;
      });
      this.lineChartLabels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      this.lineChartData = this.createLineChartData(monthlyTotals, 'Gastos Mensuales', 'rgba(255, 159, 64, 1)', 'rgba(255, 159, 64, 0.6)');
    }
  }

  private createLineChartData(data: number[], label: string, borderColor: string, backgroundColor: string): any {
    return {
      labels: this.lineChartLabels,
      datasets: [{
        data: data,
        label: label,
        fill: false,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
        tension: 0.4
      }]
    };
  }

}
