import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaComponent } from './baja.component';

describe('BajaComponent', () => {
  let component: BajaComponent;
  let fixture: ComponentFixture<BajaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
