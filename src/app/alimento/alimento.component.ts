import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlimentoService } from '../services/alimento.service';
import { GanadoService } from '../services/ganado.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alimento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './alimento.component.html',
  styleUrls: ['./alimento.component.css']
})
export class AlimentoComponent {
  alimentoForm: FormGroup;
  activeTab: 'general' | 'unitario' = 'general';
  aretesFiltrados: any[] = [];
  mostrarSugerencias: boolean = false;
  ganado: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private alimentoService: AlimentoService,
    private ganadoService: GanadoService,
    private alertService: AlertService
  ) {
    this.alimentoForm = this.fb.group({
      alimento: ['', Validators.required],
      tipoPrecios: ['general', Validators.required],
      costo: ['', [
        Validators.required,
        Validators.min(0),
        Validators.pattern(/^\d*\.?\d*$/)
      ]],
      idVaca: ['']
    });

    // Cargar datos de ganado
    this.ganadoService.getGanados().subscribe({
      next: (ganados: any) => {
        this.ganado = ganados;
        this.ganado.forEach(ganado => {
          ganado.id = '0'.repeat(12 - ganado.id.toString().length) + ganado.id.toString();
        });      
      },
      error: (error) => {
        console.error('Error al cargar ganado:', error);
      }
    });

    // Cerrar sugerencias al hacer clic fuera
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
    this.alimentoForm.patchValue({
      idVaca: arete
    });
    this.mostrarSugerencias = false;
  }

  changeTab(tab: 'general' | 'unitario') {
    this.activeTab = tab;
    if (tab === 'general') {
      this.alimentoForm.get('idVaca')?.clearValidators();
    } else {
      this.alimentoForm.get('idVaca')?.setValidators([Validators.required]);
    }
    this.alimentoForm.get('idVaca')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.alimentoForm.valid) {
      if (this.activeTab !== 'general') {
        this.alimentoService.postAlimento(
          this.alimentoForm.value.idVaca,
          this.alimentoForm.value.alimento,
          this.alimentoForm.value.costo
        ).subscribe({
          next: (response) => {
            this.alertService.showSuccess('Alimento registrado exitosamente');
            this.alimentoForm.reset();
          },
          error: (error) => {
            this.alertService.showError('Error al registrar alimento');
            console.error('Error al registrar alimento:', error);
          }
        });
      } else {
        if (this.alimentoForm.value.tipoPrecios === 'general') {
          this.alimentoService.postAlimentoAll(
            'g',
            this.alimentoForm.value.alimento,
            this.alimentoForm.value.costo
          ).subscribe({
            next: (response) => {
              this.alertService.showSuccess('Alimento registrado exitosamente');
              this.alimentoForm.reset();
            },
            error: (error) => {
              this.alertService.showError('Error al registrar alimento');
              console.error('Error al registrar alimento:', error);
            }
          });
        } else {
          this.alimentoService.postAlimentoAll(
            'u',
            this.alimentoForm.value.alimento,
            this.alimentoForm.value.costo
          ).subscribe({
            next: (response) => {
              this.alertService.showSuccess('Alimento registrado exitosamente');
              this.alimentoForm.reset();
            },
            error: (error) => {
              this.alertService.showError('Error al registrar alimento');
              console.error('Error al registrar alimento:', error);
            }
          });
        }
      }
    }
  }
}
