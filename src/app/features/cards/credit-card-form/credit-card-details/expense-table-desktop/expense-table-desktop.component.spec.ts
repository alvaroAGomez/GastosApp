import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseTableDesktopComponent } from './expense-table-desktop.component';

describe('ExpenseTableDesktopComponent', () => {
  let component: ExpenseTableDesktopComponent;
  let fixture: ComponentFixture<ExpenseTableDesktopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseTableDesktopComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseTableDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
