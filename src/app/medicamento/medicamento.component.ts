import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedicamentoService } from '../services/medicamento.service';
import { GanadoService } from '../services/ganado.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-medicamento',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './medicamento.component.html',
  styleUrl: './medicamento.component.css'
})
export class MedicamentoComponent {
  medicamentoForm: FormGroup;
  activeTab: 'general' | 'unitario' = 'general';
  aretesFiltrados: any[] = [];
  mostrarSugerencias: boolean = false;
  ganado: any[] = [];

  constructor(
    private fb: FormBuilder, 
    private medicamentoService: MedicamentoService,
    private ganadoService: GanadoService,
    private alertService: AlertService
  ) {
    this.medicamentoForm = this.fb.group({
      medicamento: ['', Validators.required],
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
    this.medicamentoForm.patchValue({
      idVaca: arete
    });
    this.mostrarSugerencias = false;
  }

  changeTab(tab: 'general' | 'unitario') {
    this.activeTab = tab;
    if (tab === 'general') {
      this.medicamentoForm.get('idVaca')?.clearValidators();
    } else {
      this.medicamentoForm.get('idVaca')?.setValidators([Validators.required]);
    }
    this.medicamentoForm.get('idVaca')?.updateValueAndValidity();
  }

  onSubmit() {
    if(this.activeTab != 'general'){
      console.log(this.medicamentoForm.value.idVaca);
      console.log(this.medicamentoForm.value.medicamento);
      console.log(this.medicamentoForm.value.costo);
      this.medicamentoService.postMedicamento(this.medicamentoForm.value.idVaca,this.medicamentoForm.value.medicamento,this.medicamentoForm.value.costo).subscribe(response => {
        this.alertService.showSuccess('Medicamento registrado exitosamente');
      });
    }else{
      if(this.medicamentoForm.value.tipoPrecios == 'general'){
        this.medicamentoService.postMedicamentoAll('g',this.medicamentoForm.value.medicamento,this.medicamentoForm.value.costo).subscribe(response => {
          this.alertService.showSuccess('Medicamento registrado exitosamente');
        });
      }else{
        this.medicamentoService.postMedicamentoAll('u',this.medicamentoForm.value.medicamento,this.medicamentoForm.value.costo).subscribe(response => {
          this.alertService.showSuccess('Medicamento registrado exitosamente');
        });
      }
    }
  }
}
