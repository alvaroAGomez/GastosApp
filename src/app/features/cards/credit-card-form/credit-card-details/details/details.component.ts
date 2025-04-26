import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Expense } from '../../../../../models/expense.model';
import { CardService } from '../../../../../services/card.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CategoryService } from '../../../../../services/category.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ExpenseChartsComponent } from '../../../../../shared/components/expense-charts/expense-charts.component';
import { NgChartsModule } from 'ng2-charts';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialog } from '@angular/material/dialog';
import { UpcomingExpensesComponent } from '../../../../expenses/upcoming-expenses/upcoming-expenses.component';

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
    MatDatepicker,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
    NgChartsModule,
    ExpenseChartsComponent,
    CustomCurrencyPipe,
    MatButtonToggleModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  cardDetails: any;
  cardHeaderDetail?: CreditCardDetailHeader;

  // Datos de la tarjeta
  cardName = 'Visa Gold';
  cardType = 'Crédito';
  cardLimit = 100000;
  currentExpense = 1500;
  banco: any;
  searchValue = '';

  // Referencias al sort y paginator
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'fecha',
    'descripcion',
    'categoria',
    'monto',
    'cuotas',
    'cuotasRestantes',
  ];

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<Expense>([]);

  filterForm: FormGroup;
  totalExpenses = 0;
  pageSize = 10;
  pageIndex = 0;
  sortField = 'fecha';
  sortDirection: 'asc' | 'desc' = 'desc';
  categories: { id: number; nombre: string }[] = [];
  selectedCardId: number | null = null;
  showCharts = false;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      fechaDesde: [''],
      fechaHasta: [''],
      categoria: ['Todas'],
      cuotasRestantes: [null],
    });
  }

  ngOnInit(): void {
    this.cardDetails = history.state.cardDetails;
    const cardId = this.route.snapshot.paramMap.get('id');
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
          // Cargar gastos solo después de obtener el header (y selectedCardId)
          this.loadExpenses();
        });
    } else {
      // Si no hay cardId, igual intentar cargar gastos (no debería pasar)
      this.loadExpenses();
    }

    this.loadCategories();

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'fecha':
          return new Date(item.fecha);
        default:
          return (item as any)[property];
      }
    };

    this.sort.active = 'fecha';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit({
      active: 'fecha',
      direction: 'desc',
    });

    // Quitar el this.loadExpenses() de aquí para evitar doble llamada
    // this.loadExpenses();
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
      categoria: '',
      cuotasRestantes: '',
    });
    this.pageIndex = 0;
    this.loadExpenses();
  }

  loadExpenses() {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (!cardId) return;
    const filters = { ...this.filterForm.value };

    if (filters.fechaDesde instanceof Date && !isNaN(filters.fechaDesde)) {
      filters.fechaDesde = filters.fechaDesde.toISOString().slice(0, 10);
    }
    if (filters.fechaHasta instanceof Date && !isNaN(filters.fechaHasta)) {
      filters.fechaHasta = filters.fechaHasta.toISOString().slice(0, 10);
    }

    this.cardService
      .getCardExpensesPaged(+cardId, {
        page: this.pageIndex + 1,
        limit: this.pageSize,
        ...filters,
        sortField: this.sortField,
        sortDirection: this.sortDirection.toUpperCase(),
      })
      .subscribe((res) => {
        this.dataSource.data = res.data.map((item: any) => ({
          ...item,
          fecha: item.fecha ? new Date(item.fecha) : null,
        }));
        this.totalExpenses = res.total;
      });
  }

  onPaginate(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadExpenses();
  }

  onSort(event: any) {
    this.sortField = event.active;
    this.sortDirection = event.direction || 'asc';
    this.loadExpenses();
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
          this.loadExpenses();
        }
      });
  }
}
