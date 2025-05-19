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
import { GastoService } from '../../../services/gasto.service';
import { Gasto } from '../../../models/gasto.model';
import { CategoriaService } from '../../../services/categoria.service';
import { CardService } from '../../../services/card.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';
import { NgxCurrencyDirective } from 'ngx-currency';

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
  selector: 'app-nuevo-gasto',
  standalone: true,
  templateUrl: './nuevo-gasto.component.html',
  styleUrl: './nuevo-gasto.component.scss',
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
export class NuevoGastoComponent implements OnInit {
  formularioGasto!: FormGroup;
  categorias: any[] = [];
  tarjetas: any[] = [];
  fechaHoy: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NuevoGastoComponent>,
    @Inject(MAT_DIALOG_DATA) public datos: any,
    private gastoService: GastoService,
    private categoriaService: CategoriaService,
    private tarjetaService: CardService,
    private toastr: ToastrService,
    private dialogo: MatDialog
  ) {}

  ngOnInit() {
    this.crearFormulario();
    this.cargarCombos();
    this.inicializarFormularioSiEdicion();

    // Si viene tarjetaCreditoId y NO es edición, setear y deshabilitar el campo
    if (!this.datos?.esEdicion && this.datos?.tarjetaCreditoId) {
      this.formularioGasto.patchValue({
        tarjetaCreditoId: this.datos.tarjetaCreditoId,
      });
      this.formularioGasto.get('tarjetaCreditoId')?.disable();
    }
  }

  private crearFormulario() {
    this.formularioGasto = this.fb.group({
      monto: ['', Validators.required],
      fecha: [this.fechaHoy, Validators.required],
      descripcion: ['', Validators.required],
      categoriaGastoId: ['', Validators.required],
      tarjetaCreditoId: [''],
      tarjetaDebitoId: [''],
      esEnCuotas: [false],
      numeroCuotas: [{ value: '', disabled: true }],
    });

    this.formularioGasto
      .get('esEnCuotas')
      ?.valueChanges.subscribe((enCuotas: boolean) => {
        const cuotasCtrl = this.formularioGasto.get('numeroCuotas');
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

  private cargarCombos() {
    this.categoriaService.getCategorias().subscribe({
      next: (res) => (this.categorias = res),
      error: () => (this.categorias = []),
    });

    this.tarjetaService.getCards().subscribe({
      next: (res) => (this.tarjetas = res),
      error: () => (this.tarjetas = []),
    });
  }

  private inicializarFormularioSiEdicion() {
    if (!this.datos?.esEdicion) return;

    this.formularioGasto.patchValue({
      monto: Number(this.datos.monto),
      fecha: this.datos.fecha ? new Date(this.datos.fecha) : this.fechaHoy,
      descripcion: this.datos.descripcion,
      categoriaGastoId:
        this.datos.categoriaGastoId ?? this.datos.categoria ?? '',
      tarjetaCreditoId: this.datos.tarjetaCreditoId ?? '',
      tarjetaDebitoId: this.datos.tarjetaDebitoId ?? '',
      esEnCuotas:
        this.datos.esEnCuotas ??
        (this.datos.cuotas && Number(this.datos.cuotas) > 1),
      numeroCuotas: this.datos.cuotas ?? '',
    });

    if (this.datos?.tarjetaCreditoDeshabilitada) {
      this.formularioGasto.get('tarjetaCreditoId')?.disable();
    }

    if (
      this.datos.esEnCuotas ||
      (this.datos.cuotas && Number(this.datos.cuotas) > 1)
    ) {
      this.formularioGasto.get('esEnCuotas')?.setValue(true);
      this.formularioGasto.get('numeroCuotas')?.enable();
    }
  }

  onSubmit() {
    if (this.formularioGasto.invalid) return;

    this.showConfirmation()
      .afterClosed()
      .subscribe((confirmado) => {
        if (confirmado !== true) return;

        const gasto = this.construirGastoDesdeFormulario();

        if (this.datos?.esEdicion && this.datos?.id) {
          this.gastoService.actualizarGasto(this.datos.id, gasto).subscribe({
            next: () => {
              this.toastr.success('Gasto actualizado con éxito', 'Éxito');
              this.dialogRef.close({ actualizado: true });
            },
            error: () =>
              this.toastr.error('Error al actualizar gasto', 'Error'),
          });
        } else {
          this.gastoService.crearGasto(gasto).subscribe({
            next: () => {
              this.toastr.success('Gasto guardado con éxito', 'Éxito');
              this.dialogRef.close({ creado: true });
            },
            error: () => this.toastr.error('Error al crear gasto', 'Error'),
          });
        }
      });
  }

  private construirGastoDesdeFormulario(): Gasto {
    const raw = this.formularioGasto.getRawValue();

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
    return this.dialogo.open(ConfirmDialogComponent, {
      data: {
        title: this.datos?.esEdicion ? 'Editar gasto' : 'Confirmar',
        message: this.datos?.esEdicion
          ? '¿Está seguro que desea actualizar el gasto?'
          : '¿Está seguro que desea guardar el gasto?',
      },
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
