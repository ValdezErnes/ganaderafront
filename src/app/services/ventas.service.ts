import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http: HttpClient) { }

  postVenta(id_ganado: number, precio_venta: number): Observable<any> {
    return this.http.post('http://localhost:8500/ventas', { id_ganado, precio_venta });
  }
  getVentas(): Observable<any> {
    return this.http.get('http://localhost:8500/ventas');
  }
}
