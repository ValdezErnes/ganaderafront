import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicamentoService {
  private apiUrl = 'http://localhost:8500/medicamentos'; 
  constructor(private http: HttpClient) { }

  getMedicamentos() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  postMedicamento(id_ganado: number,medicamento: string, costo: number) {
    console.log('envio',id_ganado,medicamento,costo);
    return this.http.post<any>(`${this.apiUrl}`, { id_ganado,nombre:medicamento, costo});
  }
  updateMedicamento(id_medicamento: number, id_ganado: number, medicamento: string, costo: number) {
    return this.http.put<any>(`${this.apiUrl}/${id_medicamento}`,{ id_ganado,medicamento, costo});
  }
  deleteMedicamento(id_ganado: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id_ganado}`);
  }
  postMedicamentoAll(tipo: string, nombre: string, costo: number) {
    return this.http.post<any>(`${this.apiUrl}/all`, { tipo, nombre, costo});
  }
}
