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

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule,
    MatExpansionModule,
    RouterModule,
    CommonModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    DynamicChartsComponent ],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {
  cardDetails: any;

  // Datos de la tarjeta
  cardName = 'Visa Gold';
  cardType = 'Crédito';
  cardLimit = 100000;
  currentExpense = 1500;

  searchValue = '';

  // Referencias al sort y paginator
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'date',
    'description',
    'category',
    'amount',
    'installments',
    'remainingInstallments'
  ];

  // Fuente de datos para la tabla
  dataSource = new MatTableDataSource<Expense>([]);

  // Array de gastos (puedes cargarlo desde un servicio, etc.)
  expenses: Expense[] = [
    {
      id: 1,
      amount: 250,
      date: new Date('2023-02-15'),
      description: 'Supermercado',
      category: 'Alimentos',
      installments: 1,
      remainingInstallments: 0,
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    {
      id: 2,
      amount: 1200,
      date: new Date('2023-03-01'),
      description: 'Compra Online',
      category: 'Tecnología',
      installments: 3,
      remainingInstallments: 2,
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
    {
      id: 3,
      amount: 90,
      date: new Date('2023-03-10'),
      description: 'Restaurante',
      category: 'Entretenimiento',
      installments: 1,
      remainingInstallments: 0,
      cardId: '1234',
      nameCard: 'Visa Gold'
    },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cardDetails = history.state.cardDetails;
    const cardId = this.route.snapshot.paramMap.get('id');
    console.log('Card ID:', this.cardDetails);
    this.cardName = this.cardDetails.CreditCard;
    this.currentExpense = this.cardDetails.Total;

    
    // Inicializamos la fuente de datos con los gastos
    this.dataSource = new MatTableDataSource(this.expenses);

    // Asignamos sort y paginator
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    // Personalizamos el sort para que la fecha sea Date (y no un string)
    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'date':
          return new Date(item.date);
        default:
          return (item as any)[property];
      }
    };

    // Ordenamos por fecha descendente al inicio
    this.sort.active = 'date';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit({
      active: 'date',
      direction: 'desc'
    });
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue;
    
    // Reset de la paginación cuando se filtra
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
