import { Component, OnInit } from '@angular/core';
import { RouterOutlet,Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-barras',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './barras.component.html',
  styleUrls: ['./barras.component.css', '../app.component.css']
})
export class BarrasComponent implements OnInit {
  title = 'TuRes';
  isUserMenuOpen = false;
  usuario: any;
  selectedItem: string = '';

  constructor(private router: Router, private alertService: AlertService) {
    if(localStorage.getItem('usuario')){
      this.usuario = JSON.parse(localStorage.getItem('usuario') ?? '');
    }else{
      this.router.navigate(['/login']);
    }
    this.selectedItem = this.router.url;
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
  navegarA(ruta: string) {
    document.getElementById(this.selectedItem)?.classList.remove('active');
    document.getElementById(ruta)?.classList.add('active');
    this.selectedItem = ruta;
    this.router.navigate([ruta]);
  }

  ngOnInit() {
    document.getElementById(this.selectedItem)?.classList.add('active');
    this.navegarA(this.selectedItem);
  }
}