import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cambiarcontra',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cambiarcontra.component.html',
  styleUrl: './cambiarcontra.component.css'
})
export class CambiarcontraComponent {
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  usuario = {
    correo: '',
    nombre: '',
    permisos: ''
  };
  inciado: boolean = true;
  constructor(private usuariosService: UsuariosService,private router: Router, private alertService: AlertService) {
    if(this.router.url=='/perfil'){
      this.inciado = true;
    }else{
      this.inciado = false;
    }
    this.usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  }

  cambiarContrasena() {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.alertService.showError('Las contraseñas no coinciden');
      return;
    }
    this.usuariosService.cambiarContra(this.usuario.correo,this.nuevaContrasena).subscribe({
      next: () => {
        this.alertService.showSuccess('Contraseña cambiada exitosamente');
        if(this.inciado){
          this.router.navigate(['/perfil']);
        }else{
          this.router.navigate(['/login']);
        }
      },
      error: (error) => {
        this.alertService.showError('Error al cambiar la contraseña: ' + error.message);
      }
    });
  }
  cancelar() {
    this.router.navigate(['/login']);
  }
}
