import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicChartsComponent } from './dynamic-charts.component';

describe('DynamicChartsComponent', () => {
  let component: DynamicChartsComponent;
  let fixture: ComponentFixture<DynamicChartsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicChartsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
