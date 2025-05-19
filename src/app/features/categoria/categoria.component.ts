import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { CategoriaService } from '../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from './ICategoria';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
})
export class CategoriaComponent {
  nuevaCategoria: Categoria = { nombre: '' };
  editandoCategoria: Categoria | null = null;
  categorias: Categoria[] = [];
  dataSource = new MatTableDataSource<Categoria>([]);
  displayedColumns = ['nombre', 'acciones'];

  constructor(
    private categoriaService: CategoriaService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategoriasPorUsuario().subscribe((cats) => {
      this.categorias = cats.map((c) => ({
        id: c.id,
        nombre: c.nombre,
        usuarioId: c.usuarioId,
      }));
      this.dataSource.data = this.categorias;
    });
  }

  enviarCategoria(form: NgForm) {
    const nombre = this.nuevaCategoria.nombre.trim();
    if (!nombre) return;

    if (this.nombreDuplicado(nombre)) {
      this.toast.info('Ya existe una categoría con ese nombre');
      return;
    }

    if (this.editandoCategoria) {
      this.actualizarCategoria(nombre, form);
    } else {
      this.agregarCategoria(nombre, form);
    }
  }

  private agregarCategoria(nombre: string, form: NgForm) {
    this.categoriaService.nuevaCategoria({ nombre }).subscribe({
      next: () => {
        this.toast.success('Categoría creada con éxito', 'Éxito');
        this.despuesDeExito(form);
      },
      error: (err) => this.mostrarError(err, 'crear categoría'),
    });
  }

  private actualizarCategoria(nombre: string, form: NgForm) {
    this.categoriaService
      .actualizarCategoria(this.editandoCategoria!.id!, { nombre })
      .subscribe({
        next: () => {
          this.toast.success('Categoría actualizada con éxito', 'Éxito');
          this.despuesDeExito(form);
        },
        error: (err) => this.mostrarError(err, 'editar categoría'),
      });
  }

  private nombreDuplicado(nombre: string): boolean {
    return this.categorias.some(
      (c) =>
        c.nombre.trim().toLowerCase() === nombre.toLowerCase() &&
        (!this.editandoCategoria || c.id !== this.editandoCategoria.id)
    );
  }

  private despuesDeExito(form: NgForm) {
    this.cargarCategorias();
    this.reiniciarFormulario(form);
  }

  private mostrarError(error: any, contexto: string) {
    this.toast.error(error?.error?.message || `Error al ${contexto}`);
  }

  iniciarEdicionCategoria(categoria: Categoria, form: NgForm) {
    this.editandoCategoria = categoria;
    this.nuevaCategoria = { ...categoria };
    form.controls['nombreCategoria']?.setValue(categoria.nombre);
  }

  cancelarEdicion(form: NgForm) {
    this.reiniciarFormulario(form);
  }

  private reiniciarFormulario(form: NgForm) {
    this.nuevaCategoria = { nombre: '' };
    this.editandoCategoria = null;
    form.resetForm();
  }

  eliminarCategoria(categoria: Categoria) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Eliminar categoría',
          message: '¿Seguro que desea eliminar la categoría?',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.categoriaService.eliminarCategoria(categoria.id!).subscribe({
            next: () => {
              this.cargarCategorias();
              this.toast.success('Categoría eliminada con éxito', 'Éxito');
            },
            error: (err) => this.mostrarError(err, 'eliminar categoría'),
          });
        }
      });
  }
}
