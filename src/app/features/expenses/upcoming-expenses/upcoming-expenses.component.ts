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
    // Mover esto después de createForm()
    if (this.data?.tarjetaCreditoId && this.data?.tarjetaCreditoDisabled) {
      this.upcomingExpenseForm
        .get('tarjetaCreditoId')
        ?.setValue(this.data.tarjetaCreditoId);
      this.upcomingExpenseForm.get('tarjetaCreditoId')?.disable();
    }
  }

  ngOnInit() {
    // Si es edición, cargar datos
    if (this.data?.isEdit) {
      this.upcomingExpenseForm.patchValue({
        monto: Number(this.data.monto),
        fecha: this.data.fecha ? new Date(this.data.fecha) : this.todayDate,
        descripcion: this.data.descripcion,
        categoriaGastoId:
          this.data.categoriaGastoId ?? this.data.categoria ?? '',
        tarjetaCreditoId: this.data.tarjetaCreditoId ?? '',
        tarjetaDebitoId: this.data.tarjetaDebitoId ?? '',
        esEnCuotas:
          this.data.esEnCuotas ??
          (this.data.cuotas && Number(this.data.cuotas) > 1),
        numeroCuotas: this.data.cuotas ?? '',
      });
      if (this.data.tarjetaCreditoDisabled) {
        this.upcomingExpenseForm.get('tarjetaCreditoId')?.disable();
      }
      if (
        this.data.esEnCuotas ||
        (this.data.cuotas && Number(this.data.cuotas) > 1)
      ) {
        this.upcomingExpenseForm.get('esEnCuotas')?.setValue(true);
        this.upcomingExpenseForm.get('numeroCuotas')?.enable();
      }
    }
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
      numeroCuotas: [{ value: '', disabled: true }],
    });

    // Controlar habilitación y validación de numeroCuotas según esEnCuotas
    this.upcomingExpenseForm
      .get('esEnCuotas')
      ?.valueChanges.subscribe((enCuotas: boolean) => {
        const cuotasCtrl = this.upcomingExpenseForm.get('numeroCuotas');
        if (enCuotas) {
          cuotasCtrl?.enable();
          cuotasCtrl?.setValidators([Validators.required, Validators.min(1)]);
        } else {
          cuotasCtrl?.reset();
          cuotasCtrl?.disable();
          cuotasCtrl?.clearValidators();
        }
        cuotasCtrl?.updateValueAndValidity();
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
            title: this.data?.isEdit ? 'Editar gasto' : 'Confirmar',
            message: this.data?.isEdit
              ? '¿Está seguro que desea actualizar el gasto?'
              : '¿Está seguro que desea guardar el gasto?',
          },
        })
        .afterClosed()
        .subscribe((confirmed) => {
          if (confirmed === true) {
            const formValue = this.upcomingExpenseForm.getRawValue();
            formValue.monto = Number(formValue.monto); // Forzar monto como number
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
            if (this.data?.isEdit && this.data?.id) {
              this.expenseService
                .actualizarGasto(this.data.id, gasto)
                .subscribe({
                  next: (res) => {
                    this.toastr.success('Gasto actualizado con éxito', 'Éxito');
                    this.dialogRef.close({ updated: true });
                  },
                  error: (err) => {
                    this.toastr.error('Error al actualizar gasto', 'Error');
                  },
                });
            } else {
              this.expenseService.crearGasto(gasto).subscribe({
                next: (res) => {
                  this.toastr.success('Gasto guardado con éxito', 'Éxito');
                  this.dialogRef.close({ created: true });
                },
                error: (err) => {
                  this.toastr.error('Error al crear gasto', 'Error');
                },
              });
            }
          }
        });
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
