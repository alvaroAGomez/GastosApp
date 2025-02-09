import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardSummaryComponent } from './credit-card-summary.component';

describe('CreditCardSummaryComponent', () => {
  let component: CreditCardSummaryComponent;
  let fixture: ComponentFixture<CreditCardSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
