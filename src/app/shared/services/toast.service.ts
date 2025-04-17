import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  success(mensaje: string, titulo: string = 'Éxito') {
    this.toastr.success(mensaje, titulo);
  }

  error(mensaje: string, titulo: string = 'Error') {
    this.toastr.error(mensaje, titulo);
  }

  warning(mensaje: string, titulo: string = 'Atención') {
    this.toastr.warning(mensaje, titulo);
  }

  info(mensaje: string, titulo: string = 'Info') {
    this.toastr.info(mensaje, titulo);
  }
}
