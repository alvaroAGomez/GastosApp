import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardToolbarComponent } from './card-toolbar.component';

describe('CardToolbarComponent', () => {
  let component: CardToolbarComponent;
  let fixture: ComponentFixture<CardToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
