import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SpinnerService } from '../../services/spinner.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; // <-- Add this import

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
})
export class SpinnerComponent {
  loading$: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.loading$ = this.spinnerService.loading$;
  }
}
