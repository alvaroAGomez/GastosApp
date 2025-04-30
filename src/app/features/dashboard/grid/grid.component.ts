import {
  AfterViewInit,
  Component,
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
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../../services/expense.service';
import { Expense } from '../../../models/expense.model';

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
    'acciones',
  ];
  dataSource!: MatTableDataSource<DashboardExpense>;
  searchValue = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() expenseAdded = new EventEmitter<void>();

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private expenseService: ExpenseService
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
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue;

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
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && (result.created || result.updated)) {
        this.expenseAdded.emit(); // <-- Esto ya notifica al dashboard
        this.reloadData();
      }
    });
  }

  editExpense(expense: any) {
    const dialogRef = this.dialog.open(UpcomingExpensesComponent, {
      disableClose: false,
      data: {
        ...expense,
        isEdit: true,
        id: expense.id,
        categoriaGastoId:
          expense.categoriaGastoId ?? expense.categoria?.id ?? null,
        tarjetaCreditoId: expense.tarjetaCreditoId ?? expense.cardId ?? null,
        tarjetaDebitoId: expense.tarjetaDebitoId ?? null,
        cuotas: expense.cuotas ?? null,
        esEnCuotas: expense.cuotas && Number(expense.cuotas) > 1 ? true : false,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.updated === true) {
        this.toastr.success('Gasto actualizado con éxito', 'Éxito');
        this.expenseAdded.emit(); // <-- Esto ya notifica al dashboard
        this.reloadData();
      }
    });
  }

  deleteExpense(expense: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar gasto',
          message: '¿Está seguro que desea eliminar este gasto?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed === true) {
          this.expenseService.eliminarGasto(expense.id).subscribe({
            next: () => {
              this.toastr.success('Gasto eliminado con éxito', 'Éxito');
              this.expenseAdded.emit(); // <-- Esto ya notifica al dashboard
              this.reloadData();
            },
            error: () => {
              this.toastr.error('Error al eliminar gasto', 'Error');
            },
          });
        }
      });
  }
}
