import {
  AfterViewInit,
  Component,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
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
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit, AfterViewInit {
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

  isMobile = false;
  mobileExpenses: DashboardExpense[] = [];
  mobilePage = 0;
  mobilePageSize = 10;
  mobileLoading = false;
  mobileAllLoaded = false;
  allMobileExpenses: DashboardExpense[] = [];

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private expenseService: ExpenseService
  ) {}
  ngOnInit(): void {
    this.checkMobile(); // 👈 ejecutarlo antes del render
  }

  ngAfterViewInit(): void {
    //this.checkMobile();
    this.reloadData();
    window.addEventListener('resize', this.checkMobile.bind(this));
  }

  checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 700;

    if (this.isMobile && !wasMobile) {
      // Cambió de web a mobile
      this.mobileExpenses = [];
      this.mobilePage = 0;
      this.mobileAllLoaded = false;
      this.loadMoreMobileExpenses();
    }

    if (!this.isMobile && wasMobile) {
      // Cambió de mobile a web
      this.reloadData(); // recarga la grilla (dataSource)
    }
  }

  reloadData() {
    if (this.isMobile) {
      this.mobileExpenses = [];
      this.mobilePage = 0;
      this.mobileAllLoaded = false;
      this.loadMoreMobileExpenses();
      return;
    }
    this.dashboardExpenseService
      .getDashboardExpenses()
      .subscribe((expenses) => {
        this.dataSource = new MatTableDataSource(expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  loadMoreMobileExpenses() {
    if (this.mobileLoading || this.mobileAllLoaded) return;
    this.mobileLoading = true;

    this.dashboardExpenseService
      .getDashboardExpenses()
      .subscribe((expenses) => {
        // Guardar todos solo la primera vez
        if (this.mobilePage === 0) {
          this.allMobileExpenses = expenses;
        }

        // Filtrado manual si hay búsqueda
        let filtered = this.allMobileExpenses;
        if (this.searchValue) {
          const filterValue = this.searchValue.toLowerCase();
          filtered = this.allMobileExpenses.filter((e) =>
            [e.descripcion, e.categoria, e.tarjeta]
              .filter(Boolean)
              .some((val) => val.toLowerCase().includes(filterValue))
          );
        }

        // Aplicar paginación
        const start = this.mobilePage * this.mobilePageSize;
        const next = filtered.slice(start, start + this.mobilePageSize);
        this.mobileExpenses = [...this.mobileExpenses, ...next];

        if (start + this.mobilePageSize >= filtered.length) {
          this.mobileAllLoaded = true;
        }

        this.mobilePage++;
        this.mobileLoading = false;
      });
  }

  onMobileScroll(event: any) {
    const el = event.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      this.loadMoreMobileExpenses();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.searchValue = filterValue;

    if (this.isMobile) {
      this.mobileExpenses = [];
      this.mobilePage = 0;
      this.mobileAllLoaded = false;
      this.loadMoreMobileExpenses(); // filtrará usando searchValue
    } else {
      this.dataSource.filter = filterValue;
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  clearFilter() {
    this.searchValue = '';

    if (this.isMobile) {
      this.mobileExpenses = [];
      this.mobilePage = 0;
      this.mobileAllLoaded = false;
      this.loadMoreMobileExpenses();
    } else {
      this.dataSource.filter = '';
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
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
