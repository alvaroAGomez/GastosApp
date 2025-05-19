import {
  AfterViewInit,
  Component,
  ViewChild,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { GastosHistorico } from '../../../../models/dashboard-expense.model';
import { DashboardExpenseService } from '../../../../services/dashboard-expense.service';
import { CustomCurrencyPipe } from '../../../../shared/pipes/custom-currency.pipe';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { NuevoGastoComponent } from '../../nuevo-gasto/nuevo-gasto.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { GastoService } from '../../../../services/gasto.service';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../../../services/categoria.service';
import { CardService } from '../../../../services/card.service';
import { MatNativeDateModule } from '@angular/material/core';
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
  @Output() gastoAgregado = new EventEmitter<void>();

  columnasMostradas: string[] = [
    'tarjeta',
    'categoria',
    'monto',
    'fecha',
    'cuotas',
    'descripcion',
    'acciones',
  ];
  dataSource!: MatTableDataSource<GastosHistorico>;

  esMobile = false;
  gastosMobile: GastosHistorico[] = [];
  todosGastosMobile: GastosHistorico[] = [];
  valorBusqueda = '';
  paginaMobile = 0;
  tamanioPaginaMobile = 10;
  cargandoMobile = false;
  todosCargadosMobile = false;

  filtros: {
    fechaDesde?: string;
    fechaHasta?: string;
    categoriaId?: number;
    tarjetaId?: number;
  } = {};
  categorias: any[] = [];
  tarjetas: any[] = [];
  mostrarFiltros = false;
  mostrarFiltrosMobile = false;

  constructor(
    private dashboardExpenseService: DashboardExpenseService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private gastoService: GastoService,
    private categoriaService: CategoriaService,
    private cardService: CardService
  ) {}

  // Inicialización
  ngOnInit(): void {
    this.verificarMobile();
    this.cargarCategorias();
    this.cargarTarjetas();
  }

  ngAfterViewInit(): void {
    this.recargarDatos();
    window.addEventListener('resize', this.verificarMobile.bind(this));
  }

  // Detección de mobile
  verificarMobile() {
    const eraMobile = this.esMobile;
    this.esMobile = window.innerWidth < 700;

    if (this.esMobile && !eraMobile) this.reiniciarEstadoMobile();
    if (!this.esMobile && eraMobile) this.recargarDatos();
  }

  // Filtros
  aplicarFiltros() {
    this.recargarDatos();
  }

  limpiarFiltros() {
    this.filtros = {};
    this.recargarDatos();
  }

  obtenerFiltrosFormateados() {
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
  recargarDatos() {
    this.esMobile ? this.reiniciarEstadoMobile() : this.cargarGastosTabla();
  }

  cargarGastosTabla() {
    this.dashboardExpenseService
      .getDashboardExpenses(this.obtenerFiltrosFormateados())
      .subscribe((gastos) => {
        this.dataSource = new MatTableDataSource(gastos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  cargarMasGastosMobile() {
    if (this.cargandoMobile || this.todosCargadosMobile) return;
    this.cargandoMobile = true;

    this.dashboardExpenseService
      .getDashboardExpenses(this.obtenerFiltrosFormateados())
      .subscribe((gastos) => {
        if (this.paginaMobile === 0) this.todosGastosMobile = gastos;

        let filtrados = this.todosGastosMobile;
        if (this.valorBusqueda) {
          const valorFiltro = this.valorBusqueda.toLowerCase();
          filtrados = filtrados.filter((e) =>
            [e.descripcion, e.categoria, e.tarjeta]
              .filter(Boolean)
              .some((val) => val.toLowerCase().includes(valorFiltro))
          );
        }

        const inicio = this.paginaMobile * this.tamanioPaginaMobile;
        const siguiente = filtrados.slice(
          inicio,
          inicio + this.tamanioPaginaMobile
        );
        this.gastosMobile = [...this.gastosMobile, ...siguiente];

        this.todosCargadosMobile =
          inicio + this.tamanioPaginaMobile >= filtrados.length;
        this.paginaMobile++;
        this.cargandoMobile = false;
      });
  }

  reiniciarEstadoMobile() {
    this.gastosMobile = [];
    this.paginaMobile = 0;
    this.todosCargadosMobile = false;
    this.cargarMasGastosMobile();
  }

  // Filtro texto
  aplicarFiltro(event: Event) {
    this.valorBusqueda = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    if (this.esMobile) this.reiniciarEstadoMobile();
    else {
      this.dataSource.filter = this.valorBusqueda;
      this.paginator?.firstPage();
    }
  }

  limpiarFiltro() {
    this.valorBusqueda = '';
    this.esMobile
      ? this.reiniciarEstadoMobile()
      : (this.dataSource.filter = '');
  }

  // Cargar opciones
  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => (this.categorias = res),
      error: () => this.toastr.error('Error al cargar categorías'),
    });
  }

  cargarTarjetas() {
    this.cardService.getCards().subscribe({
      next: (res) => (this.tarjetas = res),
      error: () => this.toastr.error('Error al cargar tarjetas'),
    });
  }

  // UI
  toggleFiltrosMobile() {
    this.mostrarFiltros = !this.mostrarFiltros;
    this.mostrarFiltrosMobile = !this.mostrarFiltrosMobile;
  }

  // CRUD
  nuevoGasto() {
    const dialogRef = this.dialog.open(NuevoGastoComponent, {
      disableClose: false,
      data: {},
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.created || resultado?.updated) {
        this.gastoAgregado.emit();
        this.recargarDatos();
      }
    });
  }

  editarGasto(gasto: any) {
    const dialogRef = this.dialog.open(NuevoGastoComponent, {
      disableClose: false,
      data: {
        ...gasto,
        isEdit: true,
        id: gasto.id,
        categoriaGastoId: gasto.categoriaGastoId ?? gasto.categoria?.id ?? null,
        tarjetaCreditoId: gasto.tarjetaCreditoId ?? gasto.cardId ?? null,
        tarjetaDebitoId: gasto.tarjetaDebitoId ?? null,
        cuotas: gasto.cuotas ?? null,
        esEnCuotas: gasto.cuotas && Number(gasto.cuotas) > 1,
      },
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.updated) {
        this.toastr.success('Gasto actualizado con éxito', 'Éxito');
        this.gastoAgregado.emit();
        this.recargarDatos();
      }
    });
  }

  eliminarGasto(gasto: any) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar gasto',
          message: '¿Está seguro que desea eliminar este gasto?',
        },
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (confirmado) {
          this.gastoService.eliminarGasto(gasto.id).subscribe({
            next: () => {
              this.toastr.success('Gasto eliminado con éxito', 'Éxito');
              this.gastoAgregado.emit();
              this.recargarDatos();
            },
            error: () => this.toastr.error('Error al eliminar gasto', 'Error'),
          });
        }
      });
  }

  // Scroll en mobile
  onMobileScroll(event: any) {
    const el = event.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      this.cargarMasGastosMobile();
    }
  }
}
