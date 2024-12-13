import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentasService } from '../services/ventas.service';
import { GanadoService } from '../services/ganado.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent {
  ventaForm: FormGroup;
  aretesFiltrados: any[] = [];
  mostrarSugerencias: boolean = false;
  ganado: any[] = [];
  costoConsultado: number | null = null;
  costoAlimentos: number | null = null;
  costoMedicamentos: number | null = null;
  costoAdquisicion: number | null = null;
  isModalActive: boolean = false;
  ganancia: number = 0;
  precioVenta: number = 0; 


  constructor(private fb: FormBuilder, private ventasService: VentasService, private ganadoService: GanadoService, private alertService: AlertService) {
    this.ventaForm = this.fb.group({
      idVaca: ['', Validators.required],
      precioVenta: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d*\.?\d*$/)
      ]]
    });
    
    this.ganadoService.getGanados().subscribe({
      next: (ganados: any) => {
        this.ganado = ganados;
        this.ganado.forEach(ganado => {
          ganado.id = '0'.repeat(12 - ganado.id.toString().length) + ganado.id.toString();
        });      
      }
    });

    document.addEventListener('click', (e: any) => {
      if (!e.target.closest('.autocomplete-container')) {
        this.mostrarSugerencias = false;
      }
    });
  }

  filtrarAretes(event: any) {
    const valor = event.target.value;
    this.mostrarSugerencias = true;
    
    if (valor) {
      this.aretesFiltrados = this.ganado
        .map(g => g.id)
        .filter(id => 
          id.toString().toLowerCase().includes(valor.toLowerCase())
        );
    } else {
      this.aretesFiltrados = [];
    }
  }

  seleccionarArete(arete: any) {
    this.ventaForm.patchValue({
      idVaca: arete
    });
    this.mostrarSugerencias = false;
  }

  async onSubmit() {
    if (this.ventaForm.valid) {
      this.consultarCosto();
      this.ventasService.postVenta(parseInt(this.ventaForm.value.idVaca), this.ventaForm.value.precioVenta).subscribe({
        next: (response) => {
          this.alertService.showSuccess('Venta registrada exitosamente');
          this.aretesFiltrados = this.aretesFiltrados.filter(id => id !== this.ventaForm.value.idVaca);
          this.isModalActive = true;
          this.ventaForm.reset();
        },
        error: (error) => {
          this.alertService.showError('Error al registrar venta');
          console.error('Error al registrar venta:', error);
        }
      });
      this.costoConsultado=null
    }
  }
  consultarCosto() {
    const id = this.ventaForm.value.idVaca;
    if(!id){
      return this.alertService.showError('No se ha seleccionado un ganado');
    }
    this.precioVenta = this.ventaForm.value.precioVenta;
    this.ganadoService.getinfo(id).subscribe({
      next: (response) => {
        this.costoAdquisicion = Number(response.ganado.precio_adquisicion)
        this.costoAlimentos = this.getCoste(response.alimentos)
        this.costoMedicamentos = this.getCoste(response.medicamentos)
        this.costoConsultado= Number(response.ganado.precio_adquisicion) + this.getCoste(response.alimentos) + this.getCoste(response.medicamentos)
        this.ganancia = Number(this.precioVenta) - Number(this.costoConsultado);
      },
      error: (error) => {
        console.error('Error al obtener información del ganado, compruebe que el arete este registrado:', error);
        this.alertService.showError('Error al obtener información del ganado, compruebe que el arete este registrado');
      }
    });
  }
  getCoste(productos: any[]): number {
    return productos.reduce((total, producto) => total + Number(producto.coste), 0);
  }
  closeModal() {
    this.isModalActive = false;
  }
}
