import { Component, Inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../../services/expense.service';
import { Expense } from '../../../models/expense.model';
import { CategoryService } from '../../../services/category.service';
import { CardService } from '../../../services/card.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';
import { NgxCurrencyDirective } from 'ngx-currency';

// Definir los formatos de fecha si es necesario
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-upcoming-expenses',
  standalone: true,
  templateUrl: './upcoming-expenses.component.html',
  styleUrl: './upcoming-expenses.component.scss',
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    NgxCurrencyDirective,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
})
export class UpcomingExpensesComponent {
  upcomingExpenseForm!: FormGroup;
  categorias: any[] = [];
  tarjetas: any[] = [];
  todayDate: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpcomingExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private cardService: CardService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {
    this.createForm();
    this.loadCategorias();
    this.loadTarjetas();
  }

  createForm() {
    this.upcomingExpenseForm = this.fb.group({
      monto: ['', [Validators.required]],
      fecha: [this.todayDate, [Validators.required]],
      descripcion: ['', [Validators.required]],
      categoriaGastoId: ['', [Validators.required]],
      tarjetaCreditoId: ['', [Validators.required]],
      tarjetaDebitoId: [],
      esEnCuotas: [false],
      numeroCuotas: [''],
    });
  }

  loadCategorias() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => (this.categorias = cats),
      error: () => (this.categorias = []),
    });
  }

  loadTarjetas() {
    this.cardService.getCards().subscribe({
      next: (cards) => (this.tarjetas = cards),
      error: () => (this.tarjetas = []),
    });
  }

  onSubmit() {
    if (this.upcomingExpenseForm.valid) {
      this.dialog
        .open(ConfirmDialogComponent, {
          data: {
            title: 'Confirmar',
            message: '¿Está seguro que desea guardar el gasto?',
          },
        })
        .afterClosed()
        .subscribe((confirmed) => {
          if (confirmed === true) {
            // Solo guardar si es true explícitamente
            const formValue = this.upcomingExpenseForm.value;
            formValue.esEnCuotas = !!formValue.tarjetaCreditoId;
            if (!formValue.tarjetaCreditoId) {
              formValue.numeroCuotas = undefined;
            }
            const gasto: Expense = {
              monto: formValue.monto,
              fecha: formValue.fecha,
              descripcion: formValue.descripcion,
              categoriaGastoId: formValue.categoriaGastoId,
              tarjetaCreditoId: formValue.tarjetaCreditoId || undefined,
              tarjetaDebitoId: formValue.tarjetaDebitoId || undefined,
              esEnCuotas: formValue.esEnCuotas,
              numeroCuotas: formValue.numeroCuotas
                ? Number(formValue.numeroCuotas)
                : undefined,
            };
            this.expenseService.crearGasto(gasto).subscribe({
              next: (res) => {
                this.toastr.success('Gasto guardado con éxito', 'Éxito');
                this.dialogRef.close(res);
              },
              error: (err) => {
                this.toastr.error('Error al crear gasto', 'Error');
              },
            });
          }
        });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
