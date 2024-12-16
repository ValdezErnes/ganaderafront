import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlimentoService {
  private apiUrl = 'http://yomero.website:8500/alimentos';

  constructor(private http: HttpClient) { }

  getAlimentos() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  
  postAlimento(id_ganado: number, nombre: string, costo: number) {
    return this.http.post<any>(`${this.apiUrl}`, { id_ganado, nombre, costo });
  }

  postAlimentoAll(tipo: string, nombre: string, costo: number) {
    return this.http.post<any>(`${this.apiUrl}/all`, { tipo, nombre, costo });
  }
}
