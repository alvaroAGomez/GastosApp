import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardFormModalComponent } from './credit-card-form-modal.component';

describe('CreditCardFormModalComponent', () => {
  let component: CreditCardFormModalComponent;
  let fixture: ComponentFixture<CreditCardFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
