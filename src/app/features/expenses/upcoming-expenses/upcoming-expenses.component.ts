import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Category } from '../../../models/category.model';
import { CommonModule } from '@angular/common';


// Importar el adaptador de fecha nativo
import { MAT_DATE_FORMATS, NativeDateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter } from '@angular/material/core';

// Definir los formatos de fecha si es necesario
const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
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
    CommonModule
  ],
  providers:[ { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT }]
})
export class UpcomingExpensesComponent {
  upcomingExpenseForm!: FormGroup;
  categories: any[] = ['Alimentación', 'Transporte', 'Entretenimiento']; // Ejemplo de categorías
  cards: any[] = [
    { id: 1, name: 'Tarjeta 1' },
    { id: 2, name: 'Tarjeta 2' }
  ]; // Ejemplo de tarjetas
  todayDate: Date = new Date(); // Fecha actual para el campo de fecha

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpcomingExpensesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Datos del modal
  ) {
    this.createForm();
  }

  createForm() {
    this.upcomingExpenseForm = this.fb.group({
      amount: ['', [Validators.required]],
      date: [this.todayDate, [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]],
      installments: [''],
      remainingInstallments: [''],
      cardId: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.upcomingExpenseForm.valid) {
      console.log(this.upcomingExpenseForm.value);
      this.dialogRef.close(this.upcomingExpenseForm.value);
    }
  }

  onClose() {
    this.dialogRef.close();
  }
}
