import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarcontraComponent } from './cambiarcontra.component';

describe('CambiarcontraComponent', () => {
  let component: CambiarcontraComponent;
  let fixture: ComponentFixture<CambiarcontraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CambiarcontraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CambiarcontraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
