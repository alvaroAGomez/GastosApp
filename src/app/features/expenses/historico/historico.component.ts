import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { GridComponent } from '../grid/grid.component';

@Component({
  selector: 'app-historico',
  imports: [
    CommonModule,
    GridComponent,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './historico.component.html',
  styleUrl: './historico.component.scss',
  standalone: true,
})
export class HistoricoComponent {}
