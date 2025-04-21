import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierslistComponent } from './supplierslist.component';

describe('SupplierslistComponent', () => {
  let component: SupplierslistComponent;
  let fixture: ComponentFixture<SupplierslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
