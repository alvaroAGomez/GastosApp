import {
  AfterViewInit,
  Component,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { GastosHistorico } from '../../../models/dashboard-expense.model';
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
import { MatSelectModule } from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { CardService } from '../../../services/card.service';
import { MatNativeDateModule } from '@angular/material/core';
import { SpinnerService } from '../../../shared/services/spinner.service';
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
    MatSelectModule,
    MatDatepickerModule,
    FormsModule,
    MatDatepicker,
    MatNativeDateModule,
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.scss',
})
export class GridComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Output() expenseAdded = new EventEmitter<void>();
  @Output() hasCardsChange = new EventEmitter<boolean>();

  displayedColumns: string[] = [
    'tarjeta',
    'categoria',
    'monto',
    'fecha',
    'cutoa',
    'descripcion',
    'acciones',
  ];
  dataSource!: MatTableDataSource<GastosHistorico>;

  isMobile = false;
  mobileExpenses: GastosHistorico[] = [];
  allMobileExpenses: GastosHistorico[] = [];
  searchValue = '';
  mobilePage = 0;
  mobilePageSize = 10;
  mobileLoading = false;
  mobileAllLoaded = false;

  filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
    categoriaId?: number;
    tarjetaId?: number;
  } = {};
  categorias: any[] = [];
  tarjetas: any[] = [];
  showFilters = false;
  mostrarFiltrosMobile = false;

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private expenseService: ExpenseService,
    private categoriaService: CategoryService,
    private cardService: CardService,
    private spinnerService: SpinnerService
  ) {}

  // Inicialización
  ngOnInit(): void {
    this.checkMobile();
    this.loadCategorias();
    this.loadTarjetas();
  }

  ngAfterViewInit(): void {
    this.reloadData();
    window.addEventListener('resize', this.checkMobile.bind(this));
  }

  // Mobile detection
  checkMobile() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 700;

    if (this.isMobile && !wasMobile) this.resetMobileState();
    if (!this.isMobile && wasMobile) this.reloadData();
  }

  // Filtros
  applyFilters() {
    this.reloadData();
  }

  limpiarFiltros() {
    this.filtros = {};
    this.reloadData();
  }

  getFiltrosFormateados() {
    return {
      ...this.filtros,
      fechaDesde: this.filtros.fechaDesde
        ? new Date(this.filtros.fechaDesde).toISOString()
        : undefined,
      fechaHasta: this.filtros.fechaHasta
        ? new Date(this.filtros.fechaHasta).toISOString()
        : undefined,
    };
  }

  // Carga de datos
  reloadData() {
    this.isMobile ? this.resetMobileState() : this.loadTableExpenses();
  }

  loadTableExpenses() {
    this.spinnerService.show();
    this.dashboardExpenseService
      .getDashboardExpenses(this.getFiltrosFormateados())
      .subscribe((expenses) => {
        this.dataSource = new MatTableDataSource(expenses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinnerService.hide();
      });
  }

  loadMoreMobileExpenses() {
    this.spinnerService.show();
    if (this.mobileLoading || this.mobileAllLoaded) return;
    this.mobileLoading = true;

    this.dashboardExpenseService
      .getDashboardExpenses(this.getFiltrosFormateados())
      .subscribe((expenses) => {
        if (this.mobilePage === 0) this.allMobileExpenses = expenses;

        let filtered = this.allMobileExpenses;
        if (this.searchValue) {
          const filterValue = this.searchValue.toLowerCase();
          filtered = filtered.filter((e) =>
            [e.descripcion, e.categoria, e.tarjeta]
              .filter(Boolean)
              .some((val) => val.toLowerCase().includes(filterValue))
          );
        }

        const start = this.mobilePage * this.mobilePageSize;
        const next = filtered.slice(start, start + this.mobilePageSize);
        this.mobileExpenses = [...this.mobileExpenses, ...next];

        this.mobileAllLoaded = start + this.mobilePageSize >= filtered.length;
        this.mobilePage++;
        this.mobileLoading = false;

        this.spinnerService.hide();
      });
  }

  resetMobileState() {
    this.mobileExpenses = [];
    this.mobilePage = 0;
    this.mobileAllLoaded = false;
    this.loadMoreMobileExpenses();
  }

  // Filtro texto
  applyFilter(event: Event) {
    this.searchValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (this.isMobile) this.resetMobileState();
    else {
      this.dataSource.filter = this.searchValue;
      this.paginator?.firstPage();
    }
  }

  clearFilter() {
    this.searchValue = '';
    this.isMobile ? this.resetMobileState() : (this.dataSource.filter = '');
  }

  // Cargar opciones
  loadCategorias() {
    this.categoriaService.getCategories().subscribe({
      next: (res) => (this.categorias = res),
      error: () => this.toastr.error('Error al cargar categorías'),
    });
  }

  loadTarjetas() {
    this.cardService.getCards().subscribe({
      next: (res) => {
        this.tarjetas = res;
        this.hasCardsChange.emit(Array.isArray(res) && res.length > 0);
      },
      error: () => this.toastr.error('Error al cargar tarjetas'),
    });
  }

  // UI
  toggleFiltrosMobile() {
    this.showFilters = !this.showFilters;
    this.mostrarFiltrosMobile = !this.mostrarFiltrosMobile;
  }

  // CRUD
  NewExpense() {
    const dialogRef = this.dialog.open(UpcomingExpensesComponent, {
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.created || result?.updated) {
        this.expenseAdded.emit();
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
        esEnCuotas: expense.cuotas && Number(expense.cuotas) > 1,
        mesPrimerPago: expense.mesPrimerPago,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.updated) {
        this.toastr.success('Gasto actualizado con éxito', 'Éxito');
        this.expenseAdded.emit();
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
        if (confirmed) {
          this.spinnerService.show();
          this.expenseService.eliminarGasto(expense.id).subscribe({
            next: () => {
              this.toastr.success('Gasto eliminado con éxito', 'Éxito');
              this.expenseAdded.emit();
              this.reloadData();
            },
            error: () => {
              this.toastr.error('Error al eliminar gasto', 'Error');
              this.spinnerService.hide();
            },
          });
        }
      });
  }

  // Scroll en mobile
  onMobileScroll(event: any) {
    const el = event.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      this.loadMoreMobileExpenses();
    }
  }
}
