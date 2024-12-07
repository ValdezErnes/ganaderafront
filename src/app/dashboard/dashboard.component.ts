import { Component, OnInit } from '@angular/core';
import { GanadoService } from '../services/ganado.service';
import { BecerrosService } from '../services/becerros.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalGanado: number = 0;
  adultos: number = 0;
  becerros: number = 0;
  
  constructor(private ganadoService: GanadoService, private becerrosService: BecerrosService) {
  }
  ngOnInit(): void {    
    this.ganadoService.getGanados().subscribe(ganado => {
      this.adultos = ganado.length;
      this.getBecerros();
      this.totalGanado = this.adultos + this.becerros;  }
    );
  }
  getBecerros(): void {
    this.becerrosService.getBecerros().subscribe(becerros => {
      this.becerros = becerros.data;
      this.totalGanado = this.adultos + this.becerros;
    });
  }
}
