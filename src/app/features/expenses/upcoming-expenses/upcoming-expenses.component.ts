import { Component, Inject, OnInit } from '@angular/core';
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
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SpinnerService } from '../../../shared/services/spinner.service';

// Definir los formatos de fecha si es necesario
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
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
export class UpcomingExpensesComponent implements OnInit {
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
    private dialog: MatDialog,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCombos();
    this.initializeFormIfEdit();
    console.log(this.data);

    // Si viene tarjetaCreditoId y NO es edición, setear y deshabilitar el campo
    if (!this.data?.isEdit && this.data?.tarjetaCreditoId) {
      this.upcomingExpenseForm.patchValue({
        tarjetaCreditoId: this.data.tarjetaCreditoId,
      });
      this.upcomingExpenseForm.get('tarjetaCreditoId')?.disable();
    }
  }

  private createForm() {
    this.upcomingExpenseForm = this.fb.group({
      monto: ['', Validators.required],
      fecha: [this.todayDate, Validators.required],
      descripcion: ['', Validators.required],
      categoriaGastoId: ['', Validators.required],
      tarjetaCreditoId: [''],
      tarjetaDebitoId: [''],
      esEnCuotas: [false],
      numeroCuotas: [{ value: '', disabled: true }],
    });

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

  private loadCombos() {
    this.categoryService.getCategories().subscribe({
      next: (res) => (this.categorias = res),
      error: () => (this.categorias = []),
    });

    this.cardService.getCards().subscribe({
      next: (res) => (this.tarjetas = res),
      error: () => (this.tarjetas = []),
    });
  }

  private initializeFormIfEdit() {
    if (!this.data?.isEdit) return;
    console.log(this.data);

    this.upcomingExpenseForm.patchValue({
      monto: Number(this.data.monto),
      fecha: this.data.fecha ? new Date(this.data.fecha) : this.todayDate,
      descripcion: this.data.descripcion,
      categoriaGastoId: this.data.categoriaGastoId ?? this.data.categoria ?? '',
      tarjetaCreditoId: this.data.tarjetaCreditoId ?? '',
      tarjetaDebitoId: this.data.tarjetaDebitoId ?? '',
      esEnCuotas:
        this.data.esEnCuotas ??
        (this.data.totalCuotas && Number(this.data.totalCuotas) > 1
          ? true
          : false),
      numeroCuotas: this.data.cuotas ?? '',
    });

    if (this.data?.tarjetaCreditoDisabled) {
      this.upcomingExpenseForm.get('tarjetaCreditoId')?.disable();
    }

    if (
      this.data.esEnCuotas ||
      (this.data.totalCuotas && Number(this.data.totalCuotas) > 1)
    ) {
      this.upcomingExpenseForm.get('esEnCuotas')?.setValue(true);
      this.upcomingExpenseForm.get('numeroCuotas')?.enable();
    }
  }

  onSubmit() {
    if (this.upcomingExpenseForm.invalid) return;

    this.showConfirmation()
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed !== true) return;

        const gasto = this.buildExpenseFromForm();
        this.spinnerService.show();
        if (this.data?.isEdit && this.data?.id) {
          this.expenseService.actualizarGasto(this.data.id, gasto).subscribe({
            next: () => {
              this.toastr.success('Gasto actualizado con éxito', 'Éxito');
              this.dialogRef.close({ updated: true });
            },
            error: () => {
              this.toastr.error('Error al actualizar gasto', 'Error');
              this.spinnerService.hide();
            },
          });
        } else {
          this.expenseService.crearGasto(gasto).subscribe({
            next: () => {
              this.toastr.success('Gasto guardado con éxito', 'Éxito');
              this.dialogRef.close({ created: true });
            },
            error: () => {
              this.toastr.error('Error al crear gasto', 'Error');
              this.spinnerService.hide();
            },
          });
        }
      });
  }

  private buildExpenseFromForm(): Expense {
    const raw = this.upcomingExpenseForm.getRawValue();

    return {
      monto: Number(raw.monto),
      fecha: raw.fecha,
      descripcion: raw.descripcion,
      categoriaGastoId: raw.categoriaGastoId,
      tarjetaCreditoId: raw.tarjetaCreditoId || undefined,
      tarjetaDebitoId: raw.tarjetaDebitoId || undefined,
      esEnCuotas: !!raw.tarjetaCreditoId,
      numeroCuotas: raw.numeroCuotas ? Number(raw.numeroCuotas) : undefined,
    };
  }

  private showConfirmation() {
    return this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.data?.isEdit ? 'Editar gasto' : 'Confirmar',
        message: this.data?.isEdit
          ? '¿Está seguro que desea actualizar el gasto?'
          : '¿Está seguro que desea guardar el gasto?',
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
