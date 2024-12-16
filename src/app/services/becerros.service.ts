import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BecerrosService {
  private apiUrl = 'http://yomero.website:8500/becerros';
  constructor(private http: HttpClient) { }
  getBecerros(): Observable<any> {
    return this.http.get<number>(`${this.apiUrl}`);
  }
  postBecerro(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, {});
  }
  deleteBecerro(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}`);
  }
}
