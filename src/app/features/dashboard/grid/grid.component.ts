import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { DashboardExpense } from '../../../models/dashboard-expense.model';
import { DashboardExpenseService } from '../../../services/dashboard-expense.service';
import { CustomCurrencyPipe } from '../../../shared/pipes/custom-currency.pipe';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { UpcomingExpensesComponent } from '../../expenses/upcoming-expenses/upcoming-expenses.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    CustomCurrencyPipe,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'tarjeta',
    'categoria',
    'monto',
    'fecha',
    'descripcion',
  ];
  dataSource!: MatTableDataSource<DashboardExpense>;
  searchValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() expenseAdded = new EventEmitter<void>();

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit(): void {
    this.reloadData();
  }

  reloadData() {
    this.dashboardExpenseService
      .getDashboardExpenses()
      .subscribe((expenses) => {
        this.dataSource = new MatTableDataSource(expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.paginator.pageSize = this.paginator.pageSizeOptions[0];
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue;

    // Reset de la paginación cuando se filtra
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  clearFilter() {
    this.searchValue = '';
    this.dataSource.filter = '';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  NewExpense() {
    const dialogRef = this.dialog.open(UpcomingExpensesComponent, {
      // width: '600px',       // Ajusta a tu gusto
      // maxWidth: '90vw',     // Para que no exceda el 90% del ancho de la ventana
      //height: 'auto',
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.expenseAdded.emit();
      }
    });
  }
}
