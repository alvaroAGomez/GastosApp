import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
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

import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  DateAdapter,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxCurrencyDirective } from 'ngx-currency';
import { SpinnerService } from '../../../shared/services/spinner.service';
import moment from 'moment';
import { Moment } from 'moment';

// ───────────────────────────────────────────────────────────
// 1) FORMATO GLOBAL PARA FECHA COMPLETA (donde porte “DD/MM/YYYY”)
// ───────────────────────────────────────────────────────────
export const MY_DATE_FORMAT: any = {
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
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' },
  ],
})
export class UpcomingExpensesComponent implements OnInit {
  upcomingExpenseForm!: FormGroup;
  categorias: any[] = [];
  tarjetas: any[] = [];
  todayDate: Date = new Date();

  // • Con @ViewChild accedemos directamente al input en HTML para sobreescribir su valor manual
  @ViewChild('monthPickerInput', { read: ElementRef })
  monthPickerInput!: ElementRef<HTMLInputElement>;

  // • Valor inicial (Moment) para “Mes/Año actual”
  currentMonthYear: Moment = moment();

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

    // Si hay tarjetaCreditoId y NO es edición, setea y deshabilita
    if (!this.data?.isEdit && this.data?.tarjetaCreditoId) {
      this.upcomingExpenseForm.patchValue({
        tarjetaCreditoId: this.data.tarjetaCreditoId,
      });
      this.upcomingExpenseForm.get('tarjetaCreditoId')?.disable();
    }

    // Después de iniciada la vista, “pintamos” el input mesPrimerPago con MM/YYYY
    // porque Angular Material por defecto lo habría dejado en “DD/MM/YYYY”
    setTimeout(() => {
      this.actualizarInputMesPrimerPagoDesdeControl();
    });
  }

  ngAfterViewInit() {
    // Siempre que el input esté presente, forzamos el formato MM/YYYY
    setTimeout(() => {
      this.actualizarInputMesPrimerPagoDesdeControl();
    });
    // Si el usuario sale del input (blur), forzamos el formato MM/YYYY
    if (this.monthPickerInput) {
      this.monthPickerInput.nativeElement.addEventListener('blur', () => {
        this.actualizarInputMesPrimerPagoDesdeControl();
      });
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
      mesPrimerPago: [this.currentMonthYear, Validators.required],
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

    // Si cambia “fecha” (día/mes/año), reseteamos mesPrimerPago
    this.upcomingExpenseForm.get('fecha')?.valueChanges.subscribe(() => {
      this.upcomingExpenseForm.get('mesPrimerPago')?.reset();
      // Limpiar el texto en el input
      if (this.monthPickerInput) {
        this.monthPickerInput.nativeElement.value = '';
      }
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

    this.upcomingExpenseForm.patchValue({
      monto: Number(this.data.montoTotal) || Number(this.data.monto),
      fecha: this.data.fecha ? new Date(this.data.fecha) : this.todayDate,
      descripcion: this.data.descripcion,
      categoriaGastoId: this.data.categoriaGastoId ?? this.data.categoria ?? '',
      tarjetaCreditoId: this.data.tarjetaCreditoId ?? '',
      tarjetaDebitoId: this.data.tarjetaDebitoId ?? '',
      esEnCuotas: this.data.esEnCuotas,
      numeroCuotas: this.data.cuotas ?? '',
      // • Si viene mesPrimerPago en data, lo convertimos a Moment;
      //   si no viene, dejamos “Mes/Año actual”
      mesPrimerPago: this.data.mesPrimerPago
        ? moment(this.data.mesPrimerPago)
        : this.currentMonthYear,
    });

    // Si estaba en modo “editar” y la tarjeta venía deshabilitada:
    if (this.data?.tarjetaCreditoDisabled) {
      this.upcomingExpenseForm.get('tarjetaCreditoId')?.disable();
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

    // • Extraigo el Moment de mesPrimerPago y lo convierto a Date
    let mesPrimerPagoValue: Date | undefined = undefined;
    if (raw.mesPrimerPago) {
      const m: Moment = raw.mesPrimerPago;
      mesPrimerPagoValue = m.toDate(); // p. ej. 2025-05-01T...
    }

    return {
      monto: Number(raw.monto),
      fecha: raw.fecha,
      descripcion: raw.descripcion,
      categoriaGastoId: raw.categoriaGastoId,
      tarjetaCreditoId: raw.tarjetaCreditoId || undefined,
      tarjetaDebitoId: raw.tarjetaDebitoId || undefined,
      esEnCuotas: !!raw.tarjetaCreditoId,
      numeroCuotas: raw.numeroCuotas ? Number(raw.numeroCuotas) : undefined,
      mesPrimerPago: mesPrimerPagoValue,
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

  // ───────────────────────────────────────────────────────────
  // 2) HANDLERS PARA SELECCIONAR AÑO Y MES (Mes/Año)
  // ───────────────────────────────────────────────────────────

  chosenYearHandler(normalizedYear: Date | Moment, datepicker: any) {
    const yearMoment: Moment =
      normalizedYear instanceof Date ? moment(normalizedYear) : normalizedYear;

    const control = this.upcomingExpenseForm.get('mesPrimerPago');
    let current: Moment = moment();
    if (control?.value && moment(control.value).isValid()) {
      current = moment(control.value);
    }
    current.year(yearMoment.year());
    control?.setValue(current);
    // Forzar actualización visual
    setTimeout(() => this.actualizarInputMesPrimerPagoDesdeControl());
    datepicker.open();
  }

  chosenMonthHandler(normalizedMonth: Date | Moment, datepicker: any) {
    const monthMoment: Moment =
      normalizedMonth instanceof Date
        ? moment(normalizedMonth)
        : normalizedMonth;

    const control = this.upcomingExpenseForm.get('mesPrimerPago');
    let current: Moment = moment();
    if (control?.value && moment(control.value).isValid()) {
      current = moment(control.value);
    }
    current.month(monthMoment.month());
    control?.setValue(current);
    setTimeout(() => this.actualizarInputMesPrimerPagoDesdeControl());
    datepicker.close();
  }

  private actualizarInputMesPrimerPagoDesdeControl() {
    if (
      this.monthPickerInput &&
      this.upcomingExpenseForm.get('mesPrimerPago')?.value
    ) {
      const m = moment(this.upcomingExpenseForm.get('mesPrimerPago')?.value);
      if (m.isValid()) {
        this.monthPickerInput.nativeElement.value = m.format('MM/YYYY');
      } else {
        this.monthPickerInput.nativeElement.value = '';
      }
    }
  }
}
