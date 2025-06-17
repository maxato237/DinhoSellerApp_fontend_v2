import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivideInvoiceComponent } from './divide-invoice.component';

describe('DivideInvoiceComponent', () => {
  let component: DivideInvoiceComponent;
  let fixture: ComponentFixture<DivideInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivideInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivideInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
