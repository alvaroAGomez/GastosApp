import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CardService } from '../../../../services/card.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoryService } from '../../../../services/category.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ExpenseChartsComponent } from '../../../../shared/components/expense-charts/expense-charts.component';
import { NgChartsModule } from 'ng2-charts';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { UpcomingExpensesComponent } from '../../../expenses/upcoming-expenses/upcoming-expenses.component';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { ExpenseService } from '../../../../services/expense.service';
import { PendingInstallmentsModalComponent } from './pending-installments-modal.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CuotaService } from '../../../../services/cuota.service';
import { GastoMensual } from '../interfaces';
import { SpinnerService } from '../../../../shared/services/spinner.service';
import { Subscription } from 'rxjs';

export interface CreditCardDetailHeader {
  tarjetaId: number;
  nombreTarjeta: string;
  banco?: string;
  limiteTotal: number;
  gastoActualMensual: number;
  totalConsumosPendientes: number;
  limiteDisponible: number;
}

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    RouterModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    NgChartsModule,
    ExpenseChartsComponent,
    CustomCurrencyPipe,
    MatButtonToggleModule,
    MatIconModule,
    MatTooltipModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, AfterViewInit {
  cardDetails: any;
  cardHeaderDetail?: CreditCardDetailHeader;
  private routeSub?: Subscription;
  // Datos de la tarjeta
  cardName = 'Visa Gold';
  cardType = 'Crédito';
  cardLimit = 100000;
  currentExpense = 1500;
  banco: any;
  searchValue = '';

  // Referencias al sort y paginator
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'fecha',
    'descripcion',
    'categoria',
    'monto',
    'cuotas',
    'acciones',
  ];

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<GastoMensual>([]);

  filterForm: FormGroup;
  totalExpenses = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'fecha';
  sortDirection: 'asc' | 'desc' = 'desc';
  categories: { id: number; nombre: string }[] = [];
  selectedCardId!: number;
  showCharts = false;
  showFilters = false;

  // NUEVO: DataSource y columnas para movimientos
  movimientosDataSource = new MatTableDataSource<any>([]);
  movimientosDisplayedColumns: string[] = [
    'fecha',
    'movimiento',
    'cuotasPendientes',
    'total',
  ];
  movimientosFooterColumns: string[] = ['footerTotal'];
  totalCuotasPendientes: number = 0;

  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private expenseService: ExpenseService,
    private cuotaService: CuotaService,
    private sipinnerService: SpinnerService
  ) {
    this.filterForm = this.fb.group({
      fechaDesde: [''],
      fechaHasta: [''],
      categoria: ['Todas'],
      //cuotasRestantes: [null],
    });
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const cardId = params['id'];
      if (cardId) {
        this.selectedCardId = +cardId;
        this.cardService
          .getCreditCardHeaderDetail(+cardId)
          .subscribe((header) => {
            this.cardHeaderDetail = header;
            this.cardName = header.nombreTarjeta;
            this.cardLimit = header.limiteTotal;
            this.currentExpense = header.gastoActualMensual;
            this.banco = header.banco;
            this.loadExpenses();
            this.loadMovimientos();
          });
      }
    });

    this.loadCategories();
    this.checkMobile();
  }

  ngAfterViewInit(): void {
    // Asigna paginator y sort después de que estén disponibles
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // Si necesitas ordenar por fecha como Date:
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'fecha') {
        return item.fecha ? new Date(item.fecha) : 0;
      }
      if (property === 'cuotas') {
        if (typeof item.cuota === 'string') {
          const match = item.cuota.match(/^(\d+)/);
          return match ? Number(match[1]) : 0;
        }
        return Number(item.cuota ?? 0);
      }
      return (item as any)[property];
    };
  }

  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 700;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe((cats: any[]) => {
      this.categories = cats;
    });
  }

  clearFilters() {
    this.filterForm.reset({
      fechaDesde: '',
      fechaHasta: '',
      categoria: 'Todas',
      cuotasRestantes: null,
    });
    this.pageIndex = 0;
    this.loadExpenses();
  }

  loadExpenses() {
    this.sipinnerService.show();
    this.expenseService
      .getGastosMensualesPorTarjeta(this.selectedCardId)
      .subscribe((res) => {
        // Asigna todos los datos a la dataSource
        this.dataSource.data = res;
        // Si quieres mostrar el total de gastos:
        this.totalExpenses = res.length;
        this.sipinnerService.hide();
      });
  }

  // NUEVO: Cargar movimientos tipo cuotas pendientes
  loadMovimientos() {
    if (!this.selectedCardId) return;
    this.cardService.getCardMovements(this.selectedCardId).subscribe((res) => {
      // res debe venir ya con los campos: fecha, descripcion, cuotasPendientes, montoCuota, total
      this.movimientosDataSource.data = res || [];
      // Sumar el total de cuotas pendientes (sumar total de cada gasto)
      this.totalCuotasPendientes = (res || []).reduce(
        (acc, mov) => acc + (mov.total || 0),
        0
      );
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

  onSearch() {
    this.pageIndex = 0;
    this.loadExpenses();
  }

  getLimitColorClass(header: CreditCardDetailHeader | undefined): string {
    if (!header) return '';
    const percent =
      header.limiteTotal > 0
        ? (header.limiteDisponible / header.limiteTotal) * 100
        : 0;
    if (percent <= 15) return 'limit-red';
    if (percent > 15 && percent <= 55) return 'limit-orange';
    return 'limit-green';
  }

  get initialPieChartFilters() {
    return { tarjeta: this.selectedCardId ?? undefined };
  }
  get initialBarChartFilters() {
    return { tarjeta: this.selectedCardId ?? undefined };
  }
  get initialLineChartFilters() {
    return { tarjeta: this.selectedCardId ?? undefined };
  }

  toggleView(event: any) {
    this.showCharts = event.value === 'charts';
  }

  onNewExpense() {
    this.dialog
      .open(UpcomingExpensesComponent, {
        disableClose: false,
        data: {
          tarjetaCreditoId: this.selectedCardId,
          tarjetaCreditoDisabled: true,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadHeaderAndExpenses();
          this.loadMovimientos();
        }
      });
  }

  editExpense(expense: any) {
    console.log('EXPEENSEE', expense);
    debugger;
    const montoTotal =
      expense.totalCuotas && Number(expense.totalCuotas) > 1
        ? expense.monto * Number(expense.totalCuotas)
        : expense.monto;
    this.dialog
      .open(UpcomingExpensesComponent, {
        disableClose: false,
        data: {
          ...expense,
          isEdit: true,
          id: expense.gastoId,
          montoTotal: montoTotal,
          categoriaGastoId: expense.categoriaGastoId || expense.categoria,
          tarjetaCreditoId: this.selectedCardId,
          tarjetaCreditoDisabled: true,
          cuotas: expense.totalCuotas ?? null,
          esEnCuotas: expense.totalCuotas && Number(expense.totalCuotas) > 1,
        },
      })
      .afterClosed()
      .subscribe((result) => {
        console.log(result);
        if (result) {
          this.toastr.success('Gasto actualizado con éxito', 'Éxito');
          this.loadHeaderAndExpenses();
          this.loadMovimientos();
        }
      });
  }

  deleteExpense(expense: any) {
    console.log(expense);

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
          this.sipinnerService.show();
          this.expenseService.eliminarGasto(expense.gastoId).subscribe({
            next: () => {
              this.toastr.success('Gasto eliminado con éxito', 'Éxito');
              this.loadHeaderAndExpenses();
              this.loadMovimientos();
            },
            error: () => {
              this.toastr.error('Error al eliminar gasto', 'Error');
            },
          });
        }
      });
  }

  loadHeaderAndExpenses() {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (cardId) {
      this.cardService
        .getCreditCardHeaderDetail(+cardId)
        .subscribe((header) => {
          this.cardHeaderDetail = header;
          this.cardName = header.nombreTarjeta;
          this.cardLimit = header.limiteTotal;
          this.currentExpense = header.gastoActualMensual;
          this.banco = header.banco;
          this.loadExpenses();
        });
    } else {
      this.loadExpenses();
    }
  }

  openPendingInstallmentsModal() {
    this.sipinnerService.show();
    this.cuotaService
      .getCuotasPendientesFuturasPorTarjeta(this.selectedCardId)
      .subscribe((res) => {
        this.dialog.open(PendingInstallmentsModalComponent, {
          width: '900px',
          maxWidth: '98vw',
          data: {
            tarjetaId: this.selectedCardId,
            movimientos: res.detalles,
            totalCuotasPendientes: res.totalGeneral,
          },
        });
        this.sipinnerService.hide();
      });
  }
}
