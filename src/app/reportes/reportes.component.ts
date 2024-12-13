import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GanadoService } from '../services/ganado.service';
import { VentasService } from '../services/ventas.service';
import { AlimentoService } from '../services/alimento.service';
import { MedicamentoService } from '../services/medicamento.service';
import { defer } from 'rxjs';



@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent implements OnInit {
  mesSeleccionado: string = '';
  fechaMaxima: string | undefined;
  reporteActual = {
    alimentos: 0,
    medicamentos: 0,
    ganado: 0,
    ventas: 0
  };
  reporteTotal: any = {
    alimentos: [],
    medicamentos: [],
    ganado: [],
    ventas: []
  }
  mostrarModal: boolean = false;
  datosModal: any[] = [];
  tituloModal: string = '';
  fechaModal: string = '';
  constructor(private ganadoService: GanadoService, private ventaService: VentasService, private alimentosService: AlimentoService, private medicamentosService: MedicamentoService) {}

  ngOnInit() {
    const fecha = new Date();
    this.fechaMaxima = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    this.mesSeleccionado = this.fechaMaxima;
    this.cargaini()
  }
  async cargaini() {
    defer(() => {
      return Promise.all([
        new Promise<void>((resolve) => {
          this.ganadoService.getGanados().subscribe({
            next: (ganado: any) => {
              this.reporteTotal.ganado = ganado;
              resolve();
            },
            error: (error: any) => {
              console.log(error);
              resolve();
            }
          });
        }),
        new Promise<void>((resolve) => {
          this.alimentosService.getAlimentos().subscribe({
            next: (alimentos: any) => {
              this.reporteTotal.alimentos = alimentos;
              resolve();
            },
            error: (error: any) => {
              console.log(error);
              resolve();
            }
          });
        }),
        new Promise<void>((resolve) => {
          this.medicamentosService.getMedicamentos().subscribe({
            next: (medicamentos: any) => {
              this.reporteTotal.medicamentos = medicamentos;
              resolve();
            },
            error: (error: any) => {
              console.log(error);
              resolve();
            }
          });
        }),
        new Promise<void>((resolve) => {
          this.ventaService.getVentas().subscribe({
            next: (ventas: any) => {
              this.reporteTotal.ventas = ventas;
              resolve();
            },
            error: (error: any) => {
              console.log(error);
              resolve();
            }
          });
        })
      ]);
    }).subscribe(() => {
      this.obtenerReporte();
    });
  }
  async obtenerReporte() {
    this.reporteActual = {
      alimentos: this.reporteTotal.alimentos?.length ? 
        this.getCoste(this.reporteTotal.alimentos.filter((alimento: any) => 
          alimento.fecha?.includes(this.mesSeleccionado)), 'coste') : 0,
      
      medicamentos: this.reporteTotal.medicamentos?.length ? 
        this.getCoste(this.reporteTotal.medicamentos.filter((medicamento: any) => 
          medicamento.fecha?.includes(this.mesSeleccionado)), 'coste') : 0,
      
      ganado: this.reporteTotal.ganado?.length ? 
        this.getCoste(this.reporteTotal.ganado.filter((ganado: any) => 
          ganado.fecha_adquisicion?.includes(this.mesSeleccionado)), 'precio_adquisicion') : 0,
      
      ventas: this.reporteTotal.ventas?.length ? 
        this.getCoste(this.reporteTotal.ventas.filter((venta: any) => 
          venta.fecha?.includes(this.mesSeleccionado)), 'precio_venta') : 0
    }
  }

  getCoste(productos: any[], campoCoste: string): number {
    return productos.reduce((total, producto) => 
      total + Number(producto[campoCoste] || 0), 0);
  }

  private formatId(id: any): string {
    return id.toString().padStart(12, '0');
  }

  private formatDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    return new Date(date).toLocaleDateString('es-ES', options);
  }

  abrirModal(tipo: string) {
    this.mostrarModal = true;
    this.fechaModal = this.mesSeleccionado;

    const mesSeleccionado = this.mesSeleccionado;

    switch (tipo) {
      case 'ganado':
        this.tituloModal = 'Compras de Ganado';
        this.datosModal = this.reporteTotal.ganado
          .filter((g: any) => g.fecha_adquisicion?.includes(mesSeleccionado))
          .map((g: any) => ({
            id: this.formatId(g.id),
            precio_adquisicion: g.precio_adquisicion,
            fecha_adquisicion: this.formatDate(g.fecha_adquisicion)
          }));
        break;
      case 'alimentos':
        this.tituloModal = 'Gastos en Alimentos';
        this.datosModal = this.reporteTotal.alimentos
          .filter((a: any) => a.fecha?.includes(mesSeleccionado))
          .map((a: any) => ({
            id_ganado: this.formatId(a.id_ganado),
            nombre_alimento: a.nombre_alimento,
            coste: a.coste,
            fecha: this.formatDate(a.fecha)
          }));
        break;
      case 'medicamentos':
        this.tituloModal = 'Gastos en Medicamentos';
        this.datosModal = this.reporteTotal.medicamentos
          .filter((m: any) => m.fecha?.includes(mesSeleccionado))
          .map((m: any) => ({
            id_ganado: this.formatId(m.id_ganado),
            nombre_medicamento: m.nombre_medicamento,
            coste: m.coste,
            fecha: this.formatDate(m.fecha)
          }));
        break;
      case 'ventas':
        this.tituloModal = 'Ventas de Ganado';
        console.log(this.reporteTotal.ventas);
        this.datosModal = this.reporteTotal.ventas
          .filter((v: any) => v.fecha?.includes(mesSeleccionado))
          .map((v: any) => ({
            id_ganado: this.formatId(v.id_ganado||''),
            precio_venta: v.precio_venta,
            fecha: this.formatDate(v.fecha)
          }));
        break;
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
