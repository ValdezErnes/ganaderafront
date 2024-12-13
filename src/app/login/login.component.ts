import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import     bcryptjs from 'bcryptjs';
import { UsuariosService } from '../services/usuarios.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formLogin;
  mail: string = '';
  contra: string = '';

  constructor(private fb: FormBuilder, private usuariosService: UsuariosService, private router: Router, private alertService: AlertService) {
    this.formLogin = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      contra: ['', [Validators.required]]
    });
    localStorage.removeItem('usuario');
  }

  
  Submitee() {
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      this.alertService.showError('Formulario inválido');
      return;
    }
    this.mail = this.formLogin.value.mail ?? '';
    this.contra = this.formLogin.value.contra ?? '';
    this.usuariosService.iniciarSesion(this.mail, this.contra).subscribe((usuarios) => {
      if (usuarios.message == 'Inicio de sesión exitoso') {
        this.mail = usuarios.nombre;
        localStorage.setItem('usuario', JSON.stringify({nombre: usuarios.nombre,correo: usuarios.correo, permisos: usuarios.permisos}));
        this.router.navigate(['/']);
      }else if(usuarios.message == 'Contraseña incorrecta'){
        this.alertService.showError('Contraseña incorrecta');
      }else if(usuarios.message == 'El usuario no existe'){
        this.alertService.showError('El usuario no existe');
      }else{
        this.alertService.showError('Error');
      }
    });
  }
  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
