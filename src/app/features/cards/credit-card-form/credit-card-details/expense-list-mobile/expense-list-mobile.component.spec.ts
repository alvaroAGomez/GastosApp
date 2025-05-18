import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseListMobileComponent } from './expense-list-mobile.component';

describe('ExpenseListMobileComponent', () => {
  let component: ExpenseListMobileComponent;
  let fixture: ComponentFixture<ExpenseListMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListMobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpenseListMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
