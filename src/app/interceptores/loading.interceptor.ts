import { HttpInterceptorFn } from "@angular/common/http";
import { finalize } from "rxjs";

let peticionesActivas = 0;

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = document.getElementById('carga');
  
  if (peticionesActivas === 0) {
    loader?.classList.add('ocultar');
  }
  
  peticionesActivas++;
  loader?.classList.remove('ocultar');

  return next(req).pipe(
    finalize(() => {
      peticionesActivas--;
      if (peticionesActivas === 0) {
        loader?.classList.add('ocultar');
      }
    })
  );
}; 