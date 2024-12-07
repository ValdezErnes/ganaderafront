import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BajasService {
  private apiUrl = 'http://localhost:8500/bajas';
  constructor(private http: HttpClient ) { }

  getBajas() {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  postBaja(id_ganado: number, motivo: string) {
    return this.http.post<any>(`${this.apiUrl}`, { id_ganado, motivo });
  }
  postbajaBecerro( motivo: string) {
    return this.http.post<any>(`${this.apiUrl}/becerro`, { motivo });
  }
}
