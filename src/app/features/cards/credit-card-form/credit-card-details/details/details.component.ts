import { DynamicChartsComponent } from './../../../../../shared/components/dynamic-charts/dynamic-charts.component';
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
    DynamicChartsComponent,
    MatDatepicker,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
    MatSelectModule,
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

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private fb: FormBuilder,
    private categoryService: CategoryService
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
      this.cardService
        .getCreditCardHeaderDetail(+cardId)
        .subscribe((header) => {
          this.cardHeaderDetail = header;
          this.cardName = header.nombreTarjeta;
          this.cardLimit = header.limiteTotal;
          this.currentExpense = header.gastoActualMensual;
          this.banco = header.banco;
        });
    }

    this.loadCategories();

    // Inicializamos la fuente de datos con los gastos
    //this.dataSource = new MatTableDataSource(this.expenses);

    // Asignamos sort y paginator
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Personalizamos el sort para que la fecha sea Date (y no un string)
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'fecha':
          return new Date(item.fecha);
        default:
          return (item as any)[property];
      }
    };

    // Ordenamos por fecha descendente al inicio
    this.sort.active = 'fecha';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit({
      active: 'fecha',
      direction: 'desc',
    });

    // Elimina la suscripción a valueChanges para evitar búsqueda automática
    // this.filterForm.valueChanges.subscribe(() => {
    //   this.pageIndex = 0;
    //   this.loadExpenses();
    // });

    // Llama una sola vez al cargar el componente
    this.loadExpenses();
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

    // Formatea fechas a 'YYYY-MM-DD' si existen
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
        // Convierte las fechas a tipo Date para que el pipe de Angular funcione
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
    debugger;
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

    // Reset de la paginación cuando se filtra
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
}
