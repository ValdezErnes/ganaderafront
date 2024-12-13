import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GanadoService } from '../services/ganado.service';
import { BecerrosService } from '../services/becerros.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.css']
})
export class AltaComponent implements OnInit {
  selectedTab: string = 'ganado';
  formGanado!: FormGroup;
  formBecerros!: FormGroup;

  constructor(
    private ganadoService: GanadoService,
    private becerrosService: BecerrosService,
    private alertService: AlertService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.formGanado = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern(/^[0-9]+$/)]],
      peso: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      fechaNacimiento: ['', Validators.required],
      precioAdquisicion: ['', [Validators.required, Validators.pattern(/^[0-9]+(\.[0-9]+)?$/)]],
      raza: [''],
      id_padre: ['', [Validators.pattern(/^[0-9]*$/)]],
      id_madre: ['', [Validators.pattern(/^[0-9]*$/)]]
    });

    this.formBecerros = this.fb.group({
      cantidadBecerros: [1, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit() {
    if (this.formGanado.valid) {
      if(this.formGanado.get('id')?.value.length!=12){
        this.alertService.showError('El arete debe tener 12 dígitos.');
        return;
      }
      if(this.formGanado.get('id_padre')?.value.length!=12 && this.formGanado.get('id_padre')?.value.length!=0){
        this.alertService.showError('El arete del padre debe tener 12 dígitos.');
        return;
      }
      if(this.formGanado.get('id_madre')?.value.length!=12 && this.formGanado.get('id_madre')?.value.length!=0){
        this.alertService.showError('El arete de la madre debe tener 12 dígitos.');
        return;
      }
      const ganado = this.formGanado.value;
      this.ganadoService.postGanado(ganado.id, ganado.peso, ganado.fechaNacimiento, ganado.precioAdquisicion).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Ganado registrado exitosamente');
          if(ganado.id_padre>0 || ganado.id_madre>0){
            this.ganadoService.postPadres(ganado.id, ganado.id_padre, ganado.id_madre).subscribe({
              next: (response) => {
              },error: (error) => {
                this.alertService.showError('Error al registrar padres ');
              }
            });
            if(ganado.raza!=''){
              this.ganadoService.postRaza(ganado.id, ganado.raza).subscribe({
                next: (response) => {
                },error: (error) => {
                  this.alertService.showError('Error al registrar raza ');
                }
              });
            }
            this.limpiarFormulario();
          }
        },
        error: (error) => {
          this.alertService.showError('Error al registrar ganado ');
        }
      });
    }
  }

  onSubmitBecerros() {
    if (this.formBecerros.valid) {
      const cantidad = this.formBecerros.value.cantidadBecerros;
      for(let i=0;i<cantidad;i++){
        this.becerrosService.postBecerro().subscribe({
          next: (response) => {
            this.alertService.showSuccess('Becerro registrado exitosamente');
          },
          error: (error) => {
            this.alertService.showError('Error al registrar becerro');
            if (i>0) {
              this.alertService.showSuccess('Becerro/s registrado/s exitosamente: '+i);
            }
          }
        });
      }
      this.formBecerros.reset();
    }
  }

  private limpiarFormulario() {
    this.formGanado.reset();
    this.formBecerros.reset();
  }

}