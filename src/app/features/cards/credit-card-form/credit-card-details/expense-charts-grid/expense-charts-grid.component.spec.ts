import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseChartsGridComponent } from './expense-charts-grid.component';

describe('ExpenseChartsGridComponent', () => {
  let component: ExpenseChartsGridComponent;
  let fixture: ComponentFixture<ExpenseChartsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseChartsGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseChartsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
