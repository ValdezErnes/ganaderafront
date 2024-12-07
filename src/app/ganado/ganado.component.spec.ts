import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GanadoComponent } from './ganado.component';

describe('GanadoComponent', () => {
  let component: GanadoComponent;
  let fixture: ComponentFixture<GanadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GanadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GanadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
