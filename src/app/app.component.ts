import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { BarrasComponent } from "./barras/barras.component";
import { RecuperarContraComponent } from "./recuperar-contra/recuperar-contra.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { AltaComponent } from "./alta/alta.component";
import { FormsModule, ReactiveFormsModule ,FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarrasComponent, RecuperarContraComponent,LoaderComponent, AltaComponent, FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
    constructor(public router: Router) {
    const inicio=localStorage.getItem('usuario');
    if (inicio == null) {
      // if (this.router.url != '/recuperarContra'&&this.router.url != '/login') {
      //   this.router.navigate(['/login']);
      // }
    }
  }
}
