import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GanadoService } from '../services/ganado.service';
import { BecerrosService } from '../services/becerros.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alta.component.html',
  styleUrl: './alta.component.css'
})
export class AltaComponent {
  selectedTab: string = 'ganado';
  id: number = 0;
  peso: number = 0;
  fechaNacimiento: string = '';
  precioAdquisicion: number = 0;
  cantidadBecerros: number = 1;
  raza: string = '';
  id_padre: string = '';
  id_madre: string = '';

  constructor(private ganadoService: GanadoService, private becerrosService: BecerrosService, private alertService: AlertService) {}

  onSubmit() {
    const ganado = {
      id: this.id,
      peso_registro: this.peso,
      fecha_nacimiento: this.fechaNacimiento,
      precio_adquisicion: this.precioAdquisicion,
      raza: this.raza,
      id_padre: this.id_padre,
      id_madre: this.id_madre
    };
    this.ganadoService.postGanado(
      ganado.id, 
      ganado.peso_registro, 
      ganado.fecha_nacimiento, 
      ganado.precio_adquisicion,
    ).subscribe({
      next: (response) => {
        this.alertService.showSuccess('Ganado registrado exitosamente');
        if(ganado.id_padre!='' || ganado.id_madre!=''){
          this.ganadoService.postPadres(ganado.id, parseInt(ganado.id_padre), parseInt(ganado.id_madre)).subscribe({
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

  onSubmitBecerros() {
    if (this.cantidadBecerros > 0) {
      for(let i=0;i<this.cantidadBecerros;i++){
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
      this.cantidadBecerros = 1; // Reset después del registro
    }
  }

  private limpiarFormulario() {
    this.id = 0;
    this.peso = 0;
    this.fechaNacimiento = '';
    this.precioAdquisicion = 0;
    this.raza = '';
    this.id_padre = '';
    this.id_madre = '';
  }
}