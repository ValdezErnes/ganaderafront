import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { BajasService } from '../services/bajas.service';
import { GanadoService } from '../services/ganado.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-baja',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './baja.component.html',
  styleUrl: './baja.component.css'
})
export class BajaComponent {
  bajaForm: FormGroup;
  motivos = ['Muerte', 'Regalo', 'Robo', 'Pérdida'];
  tipos = ['Res', 'Becerro'];
  ganado: any[] = [];
  aretesFiltrados: any[] = [];
  mostrarSugerencias: boolean = false;

  constructor(private fb: FormBuilder, private bajasService: BajasService, private ganadoService: GanadoService, private alertService: AlertService ) {
    this.bajaForm = this.fb.group({
      tipo: ['', Validators.required],
      arete: [''],
      cantidad: [''],
      motivo: ['', Validators.required]
    });

    this.bajaForm.get('tipo')?.valueChanges.subscribe(tipo => {
      if (tipo === 'Res') {
        this.bajaForm.get('arete')?.setValidators([Validators.required]);
        this.bajaForm.get('cantidad')?.clearValidators();
      } else {
        this.bajaForm.get('cantidad')?.setValidators([Validators.required]);
        this.bajaForm.get('arete')?.clearValidators();
      }
      this.bajaForm.get('arete')?.updateValueAndValidity();
      this.bajaForm.get('cantidad')?.updateValueAndValidity();
    });
    this.ganadoService.getGanados().subscribe({
      next: (ganados: any) => {
        this.ganado = ganados;
      },
      error: (error: any) => {
        this.alertService.showError('Error al obtener ganado');
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
    this.bajaForm.patchValue({
      arete: arete
    });
    this.mostrarSugerencias = false;
  }

  onSubmit() {
      console.log(this.bajaForm.value);
      if (this.bajaForm.value.tipo === 'Res') {
        let id_ganado : number;
        id_ganado = this.bajaForm.value.arete;
        let motivo : string;
        motivo = this.bajaForm.value.motivo;
        
        this.bajasService.postBaja(id_ganado, motivo).subscribe({
          next: (response) => {
            this.alertService.showSuccess('Baja registrada exitosamente');
          },
          error: (error) => {
            this.alertService.showError('Error al registrar la baja de res');
          }
        });
      } else {
        let motivo : string;
        motivo = this.bajaForm.value.motivo;
        this.bajasService.postbajaBecerro(motivo).subscribe({
          next: (response) => {
            this.alertService.showSuccess('Baja registrada exitosamente');
          },
          error: (error) => {
            this.alertService.showError('Error al registrar la baja');
          }
        });
      }
  }
}
