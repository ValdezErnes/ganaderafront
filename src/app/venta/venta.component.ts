import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VentasService } from '../services/ventas.service';
import { GanadoService } from '../services/ganado.service';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent {
  ventaForm: FormGroup;
  aretesFiltrados: any[] = [];
  mostrarSugerencias: boolean = false;
  ganado: any[] = [];

  constructor(private fb: FormBuilder, private ventasService: VentasService, private ganadoService: GanadoService) {
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

  onSubmit() {
    if (this.ventaForm.valid) {
      this.ventasService.postVenta(parseInt(this.ventaForm.value.idVaca), this.ventaForm.value.precioVenta).subscribe({
        next: (response) => {
          console.log('Venta registrada exitosamente:', response);
          alert('Venta registrada exitosamente');
          this.ventaForm.reset();
        },
        error: (error) => {
          alert('Error al registrar venta');
          console.error('Error al registrar venta:', error);
        }
      });
    }
  }
}
