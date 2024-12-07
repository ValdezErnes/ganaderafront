import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuariosService } from '../services/usuarios.service';
import * as bcryptjs from 'bcryptjs';

interface Usuario {
  nombre: string;
  correo: string;
  permisos: string;
}

interface Permiso {
  correo: string;
  permisos: string[];
}

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {
  activeTab: 'usuarios' | 'permisos' = 'usuarios';
  usuarioForm: FormGroup;
  showUsuarioModal = false;
  selectedUserEmail = '';
  usuarios: Usuario[] = [];
  showErrorPermisos = false;
  showDeleteModal = false;
  usuarioToDelete: string = '';

  permisosDisponibles = [
    'Ganado', 'Alta', 'Baja', 'Venta', 'Medicamento', 'Alimento', 'Reportes'
  ];

  constructor(private fb: FormBuilder, private UsuariosService: UsuariosService) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      Ganado: [false],
      Alta: [false],
      Baja: [false],
      Venta: [false],
      Medicamento: [false],
      Alimento: [false],
      Reportes: [false]
    }, { validator: this.atLeastOnePermissionSelected });
    this.getusuarios();
  }

  atLeastOnePermissionSelected(group: FormGroup): {[key: string]: any} | null {
    const permisos = [
      'Alta', 'Baja', 'Venta', 
      'Medicamento', 'Alimento', 'Reportes', 'Ganado'
    ];
    
    const seleccionado = permisos.some(permiso => group.get(permiso)?.value === true);
    
    return seleccionado ? null : { requirePermission: true };
  }

  getusuarios(){
    this.UsuariosService.getUsuarios().subscribe(
      (response: any) => {
        this.usuarios = response.filter((usuario: any) => 
          !usuario.permisos.split(',').includes('Usuarios')
        );
        console.log(this.usuarios);
      }
    );
  }


  changeTab(tab: 'usuarios' | 'permisos') {
    this.activeTab = tab;
  }

  obtenerPermisosUsuario(permisos: string): string[] {
    return permisos ? permisos.split(',').map(p => p.trim()) : [];
  }

  editarUsuarioCompleto(usuario: Usuario) {
    this.usuarioForm.patchValue({
      nombre: usuario.nombre,
      correo: usuario.correo
    });
    
    this.permisosDisponibles.forEach(permiso => {
      this.usuarioForm.get(permiso)?.setValue(false);
    });
    
    const permisosUsuario = this.obtenerPermisosUsuario(usuario.permisos);
    permisosUsuario.forEach(permiso => {
      this.usuarioForm.get(permiso)?.setValue(true);
    });

    this.selectedUserEmail = usuario.correo;
    this.showUsuarioModal = true;
  }

  async guardarUsuarioCompleto() {
    const formValues = this.usuarioForm.value;
    const permisosSeleccionados = this.permisosDisponibles
      .filter(permiso => formValues[permiso]);

    if (permisosSeleccionados.length === 0) {
      this.showErrorPermisos = true;
      return;
    }

    if (this.usuarioForm.valid) {
      const usuarioCompleto = {
        nombre: formValues.nombre,
        correo: formValues.correo,
        permisos: permisosSeleccionados.join(',')
      };

      if (this.selectedUserEmail) {
        console.log('Editar usuario:', usuarioCompleto);
        this.UsuariosService.updateUsuario(this.selectedUserEmail, usuarioCompleto.correo, usuarioCompleto.nombre, usuarioCompleto.permisos).subscribe(
          (response: any) => {
            console.log('editar: ' ,response);
            const index = this.usuarios.findIndex(u => u.correo === this.selectedUserEmail);
            if (index !== -1) {
              this.usuarios[index] = usuarioCompleto;
            }
          }
        );
      } else {
        console.log('Crear nuevo usuario:', usuarioCompleto);
        const contra = await bcryptjs.hash('tuvaquero', 10);
        
        this.UsuariosService.postUsuario(
          usuarioCompleto.nombre,
          usuarioCompleto.correo,
          usuarioCompleto.permisos,
          contra
        ).subscribe(
          (response: any) => {
            console.log('crear: ' ,response);
            this.usuarios.push(usuarioCompleto);
          }
        );
      }

      this.showUsuarioModal = false;
      this.usuarioForm.reset();
      this.showErrorPermisos = false;
    }
  }

  cancelarEdicionUsuario() {
    this.showUsuarioModal = false;
    this.usuarioForm.reset();
    this.showErrorPermisos = false;
  }

  confirmarEliminar(correo: string) {
    this.usuarioToDelete = correo;
    this.showDeleteModal = true;
  }

  eliminarUsuario(correo: string) {
    console.log('Eliminar usuario:', this.usuarioToDelete);
    this.showDeleteModal = false;
    this.usuarioToDelete = '';
    this.UsuariosService.deleteUsuario(correo).subscribe(
      (response: any) => {
        console.log(response);
      }
    );
    this.usuarios = this.usuarios.filter(usuario => usuario.correo !== correo);
  }

  cancelarEliminacion() {
    this.showDeleteModal = false;
    this.usuarioToDelete = '';
  }

  abrirModalPermisos(correo: string) {
    this.selectedUserEmail = correo;
    const usuario = this.usuarios.find(u => u.correo === correo);
    
    if (usuario) {
      this.permisosDisponibles.forEach(permiso => {
        this.usuarioForm.get(permiso)?.setValue(false);
      });
      
      const permisosUsuario = this.obtenerPermisosUsuario(usuario.permisos);
      permisosUsuario.forEach(permiso => {
        this.usuarioForm.get(permiso)?.setValue(true);
      });
    }
    
    this.showUsuarioModal = true;
  }

  guardarPermisos() {
    const formValues = this.usuarioForm.value;
    const permisosSeleccionados = this.permisosDisponibles
      .filter(permiso => formValues[permiso]);

    console.log('Guardar permisos para:', this.selectedUserEmail, permisosSeleccionados);
    this.showUsuarioModal = false;
  }

  cancelarPermisos() {
    this.showUsuarioModal = false;
  }

  abrirModalNuevoUsuario() {
    this.selectedUserEmail = '';
    this.usuarioForm.reset();
    this.showErrorPermisos = false;
    this.showUsuarioModal = true;
  }
}
