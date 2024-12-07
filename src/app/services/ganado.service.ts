import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GanadoService {
  private apiUrl = 'http://localhost:8500/ganado';
  constructor(private http: HttpClient ) { }

  getGanados() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  postGanado(id_ganado: number, peso_registro: number, fecha_nacimiento: string, precio_adquisicion: number) {
    return this.http.post<any>(`${this.apiUrl}`, { id_ganado,peso_registro, fecha_nacimiento, precio_adquisicion });
  }
  updateGanado(id_ganado: number, peso_registro: number, fecha_nacimiento: string, precio_adquisicion: number) {
    return this.http.put<any>(`${this.apiUrl}/${id_ganado}`, { peso_registro, fecha_nacimiento, precio_adquisicion });
  }
  deleteGanado(id_ganado: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id_ganado}`);
  }
  getinfo(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  postRaza(id: number, nombre: string) {
    return this.http.post<any>(`${this.apiUrl}/raza`, { id, nombre });
  }
  postPadres(id: number, id_padre: number, id_madre: number) {
    return this.http.post<any>(`${this.apiUrl}/padres`, { id, id_padre, id_madre });
  }
}
