import { Component } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { BarrasComponent } from "./barras/barras.component";
import { RecuperarContraComponent } from "./recuperar-contra/recuperar-contra.component";
import { LoaderComponent } from "./components/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BarrasComponent, RecuperarContraComponent,LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(public router: Router) {
    const inicio=localStorage.getItem('usuario');
    if (inicio == null) {
      if (this.router.url != '/recuperarContra'&&this.router.url != '/login') {
        this.router.navigate(['/login']);
      }
    }
  }
}
