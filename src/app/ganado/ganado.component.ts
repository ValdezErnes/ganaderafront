import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GanadoService } from '../services/ganado.service';
import { BecerrosService } from '../services/becerros.service';

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
  nuevoBecerro: NuevoBecerro = {
    arete: '',
    fechaNacimiento: '',
    peso: 0,
    costo: 0,
    raza: '',
    id_padre: '',
    id_madre: ''
  };
  mostrarModal: boolean = false;
  infoGanado: InfoGanado | null = null;
  activeAccordion: string | null = null;
  searchArete: string = '';
  resesFiltradas: Res[] = [];
  

  constructor(private ganadoService: GanadoService, private becerrosService: BecerrosService) {
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

  registrarBecerro() {
    if (this.validarFormularioBecerro()) {
      this.becerrosService.postBecerro().subscribe({
        next: (response) => {
          console.log('Becerro registrado exitosamente:', response);
          this.limpiarFormularioBecerro();
          this.cargarDatos(); // Recargar datos después de registrar
        },
        error: (error) => {
          console.error('Error al registrar becerro:', error);
        }
      });
    }
  }

  private validarFormularioBecerro(): boolean {
    return !!(
      this.nuevoBecerro.arete &&
      this.nuevoBecerro.fechaNacimiento &&
      this.nuevoBecerro.peso > 0 &&
      this.nuevoBecerro.costo > 0
    );
  }

  private limpiarFormularioBecerro() {
    this.nuevoBecerro = {
      arete: '',
      fechaNacimiento: '',
      peso: 0,
      costo: 0,
      raza: '',
      id_padre: '',
      id_madre: ''
    };
  }
  informacion(id: number) {
    this.ganadoService.getinfo(id).subscribe({
      next: (response) => {
        alert(response.ganado.id);
          this.infoGanado = {
            arete: response.ganado.id,
            raza: response.raza || 'No registrada',
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
}
