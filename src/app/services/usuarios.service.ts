import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = 'http://yomero.website:8500/usuarios';
  constructor(private http: HttpClient ) { }

  getUsuarios(): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }
  postUsuario(nombre: string, correo: string, permisos: string,contra: string): Observable<any> {
    console.log('servicio',contra);
    return this.http.post<any>(`${this.apiUrl}`, { nombre, correo, permisos,contra });
  }
  updateUsuario(correo: string, correo2: string, nombre: string, permisos: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${correo}`, { correo2, nombre, permisos });
  }
  deleteUsuario(correo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${correo}`);
  }
  iniciarSesion(mail: string, contra: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/iniciarSesion`, { mail, contra });
  }
  recuperarCodigo(correo: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/recuperarContra`, { correo });
  }
  cambiarContra(correo: string, contra: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/cambiarContra`, { correo, contra });
  }
}
