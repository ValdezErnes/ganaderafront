import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GanadoService } from '../services/ganado.service';
import { BecerrosService } from '../services/becerros.service';
import { AlertService } from '../services/alert.service';

interface Res {
  id: number;
  edad: number;
  peso_registro: string;
  fecha_nacimiento: string;
  precio_adquisicion: string;
  fecha_adquisicion: string;
}

interface GanadoResumen {
  tipo: string;
  cantidad: number;
}

interface NuevoBecerro {
  arete: string;
  fechaNacimiento: string;
  peso: number;
  costo: number;
  raza?: string;
  id_padre?: string;
  id_madre?: string;
}

interface InfoGanado {
  arete: any;
  raza: any;
  padres: any[];
  alimentos: any[];
  medicamentos: any[];
  costeAdquisicion: number;
  costeAlimentos: number;
  costeMedicamentos: number;  
  costeTotal: number;
}

@Component({
  selector: 'app-ganado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ganado.component.html',
  styleUrl: './ganado.component.css'
})
export class GanadoComponent implements OnInit {
  reses: Res[] = [];
  resumenGanado: GanadoResumen[] = [
    { tipo: 'Becerros', cantidad: 0 },
    { tipo: 'Res', cantidad: 0 }
  ];
  selectedTab: string = 'ganado';
  arete: number = 0;
  fechaNacimiento: string = '';
  peso: number = 0;
  costo: number = 0;
  raza: string = '';
  id_padre: number = 0;
  id_madre: number = 0;
  mostrarModal: boolean = false;
  infoGanado: InfoGanado | null = null;
  activeAccordion: string | null = null;
  searchArete: string = '';
  resesFiltradas: Res[] = [];
  

  constructor(private ganadoService: GanadoService, private becerrosService: BecerrosService, private alertService: AlertService) {
    this.infoGanado = {
      arete: '',
      raza: '',
      padres: [],
      alimentos: [],
      medicamentos: [],
      costeAdquisicion: 0,
      costeAlimentos: 0,
      costeMedicamentos: 0,
      costeTotal: 0
    }
  }

  ngOnInit() {
    this.cargarDatos();
  }

  private cargarDatos() {
    this.ganadoService.getGanados().subscribe({
      next: (reses: Res[]) => {
        this.reses = reses;
        this.resesFiltradas = reses;
        this.becerrosService.getBecerros().subscribe({
          next: (becerros) => {
            this.actualizarResumen(reses.length, becerros.data);
          },
          error: (error) => {
            console.error('Error al obtener becerros:', error);
            this.actualizarResumen(reses.length, 0);
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener ganado:', error);
        this.actualizarResumen(0, 0);
      }
    });
  }

  private actualizarResumen(cantidadAdultos: number, cantidadBecerros: number = 0) {
    this.resumenGanado = [
      { tipo: 'Becerros', cantidad: cantidadBecerros },
      { tipo: 'Res', cantidad: cantidadAdultos }
    ];
  }

  formatearFecha(fecha: string, mes: boolean): string {
    const [year, month, day] = fecha.split('T')[0].split('-');
    const fechaLocal = new Date(Number(year), Number(month) - 1, Number(day));

    if(mes) {
      const opciones: Intl.DateTimeFormatOptions = { 
        month: 'long', 
        year: 'numeric'
      };
      const fechaFormateada = fechaLocal.toLocaleDateString('es-ES', opciones);
      return fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
    }
    return fechaLocal.toLocaleDateString();
  }


  private limpiarFormularioBecerro() {
    this.arete = 0;
    this.fechaNacimiento = '';
    this.peso = 0;
    this.costo = 0;
    this.raza = '';
    this.id_padre = 0;
    this.id_madre = 0;
  }

  informacion(id: number) {
    this.ganadoService.getinfo(id).subscribe({
      next: (response) => {
        console.log(response);
          this.infoGanado = {
            arete: response.ganado.id,
            raza: response.raza ? response.raza.nombre : 'No registrada',
            padres: response.padres ? 
              [`Padre: ${response.padres.id_padre || 'No registrado'}`, 
               `Madre: ${response.padres.id_madre || 'No registrado'}`] :
              ['Padre: No registrado', 'Madre: No registrado'],
            alimentos: response.alimentos,
            medicamentos: response.medicamentos,
            costeAdquisicion: Number(response.ganado.precio_adquisicion),
            costeAlimentos: this.getCoste(response.alimentos),
            costeMedicamentos: this.getCoste(response.medicamentos),
            costeTotal: Number(response.ganado.precio_adquisicion) + this.getCoste(response.alimentos) + this.getCoste(response.medicamentos)
          };
          this.mostrarModal = true;
      },
      error: (error) => {
        console.error('Error al obtener información del ganado:', error);
      }
    });
  }
  getCoste(productos: any[]): number {
    return productos.reduce((total, producto) => total + Number(producto.coste), 0);
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  toggleAccordion(section: string) {
    this.activeAccordion = this.activeAccordion === section ? null : section;
  }
  getEdad(fechaNacimiento: string): number {
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const edad = Math.floor((Date.now() - fechaNacimientoDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    return edad;
  }

  filtrarGanado() {
    if (!this.searchArete.trim()) {
      this.resesFiltradas = this.reses;
    } else {
      this.resesFiltradas = this.reses.filter(res => 
        res.id.toString().toLowerCase().includes(this.searchArete.toLowerCase())
      );
    }
  }
  registrarBecerro() {
    const ganado = {
      id: this.arete,
      peso_registro: this.peso,
      fecha_nacimiento: this.fechaNacimiento,
      precio_adquisicion: this.costo,
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
          this.resumenGanado[0].cantidad--;
          this.resumenGanado[1].cantidad++;
          this.limpiarFormularioBecerro();
        }
      },
      error: (error) => {
        this.alertService.showError('Error al registrar ganado ');
      }
    });
  }
  formatearArete(id: number): string {
    return '0'.repeat(12 - id.toString().length) + id.toString();
  }
}
