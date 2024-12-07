import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  showSuccess(message: string) {
    Swal.fire({
      text: message,
      timer: 1000,
      showConfirmButton: false,
      icon: 'success'
    });
  }
  showError(message: string) {
    Swal.fire({
      text: message,
      timer: 1000,
      showConfirmButton: false,
      icon: 'error'
    });
  }
}
