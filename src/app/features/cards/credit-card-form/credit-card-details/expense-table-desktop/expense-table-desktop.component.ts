import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-expense-table-desktop',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    CustomCurrencyPipe,
  ],
  templateUrl: './expense-table-desktop.component.html',
  styleUrls: ['./expense-table-desktop.component.scss'],
})
export class ExpenseTableDesktopComponent implements OnChanges, AfterViewInit {
  @Input() data: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() pageSizeOptions: number[] = [5, 10, 20];
  @Input() pageSize: number = 10;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() pageEvent = new EventEmitter<PageEvent>();
  @Output() sortEvent = new EventEmitter<Sort>();

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.sort.sortChange.subscribe((e) => this.sortEvent.emit(e));
    this.paginator.page.subscribe((e) => this.pageEvent.emit(e));
  }

  onEdit(row: any) {
    this.edit.emit(row);
  }
  onDelete(row: any) {
    this.delete.emit(row);
  }
}
