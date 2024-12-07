import { Component } from '@angular/core';
import { CambiarcontraComponent } from '../cambiarcontra/cambiarcontra.component';

interface Usuario {
  nombre: string;
  permisos: string;
  correo: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CambiarcontraComponent],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  cambiarContra: boolean = false;
  usuario: Usuario = {
    nombre: '',
    permisos: '',
    correo: ''
  };
  constructor() {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
    console.log(this.usuario);
    console.log(this.usuario.correo);
    console.log(localStorage.getItem('usuario'));
  }
  

  cambiarContrasena() {
    this.cambiarContra = !this.cambiarContra;
  }
}
