import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { CambiarcontraComponent } from '../cambiarcontra/cambiarcontra.component';

@Component({
  selector: 'app-recuperar-contra',
  standalone: true,
  imports: [CommonModule, FormsModule, CambiarcontraComponent],
  templateUrl: './recuperar-contra.component.html',
  styleUrl: './recuperar-contra.component.css'
})
export class RecuperarContraComponent {
  correo: string = '';
  codigo: string = '';
  codigoEnvio: string = '';
  mostrarIngresoCodigo: boolean = false;
  mostrarNuevaContra: boolean = false;
  nuevaContrasena: string = '';
  confirmarContrasena: string = '';
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router, private usuariosService: UsuariosService ) {}

  regresar() {
    this.router.navigate(['/login']);
  }

  solicitarCodigo() {
    this.usuariosService.recuperarCodigo(this.correo)
      .subscribe({
        next: (response: any) => {
          if (response.message==='El correo no esta registrado') {
            return alert(response.message);
          }
          this.mensaje = 'Código enviado al correo';
          this.codigoEnvio=response.codigo;
          this.mostrarIngresoCodigo = true;
        },
        error: (error) => {
          this.mensaje = error.error.message || 'Error al enviar el código';
        }
      });
  }

  verificarCodigo() {
    if (this.codigo.length === 6) {
      if (this.codigo === this.codigoEnvio) {
        localStorage.setItem('usuario', JSON.stringify({correo:this.correo}));
        console.log(JSON.parse(localStorage.getItem('usuario') || '{}'));
        this.mostrarNuevaContra = true;
        this.mostrarIngresoCodigo = false;
      } else {
        alert('El código es incorrecto');
      }
    } else {
      this.mensaje = 'El código debe tener 6 dígitos';
    }
  }

  cambiarContrasena() {
    if (this.nuevaContrasena !== this.confirmarContrasena) {
      this.mensaje = 'Las contraseñas no coinciden';
      return;
    }
    
    this.usuariosService.cambiarContra(this.correo, this.nuevaContrasena)
      .subscribe({
        next: (response: any) => {
          alert('Contraseña actualizada exitosamente');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.mensaje = error.error.message || 'Error al cambiar la contraseña';
        }
      });
  }
}
