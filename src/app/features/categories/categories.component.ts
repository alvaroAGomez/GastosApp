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
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';
import { Categoria } from './ICategoria';

/* interface Category {
  id?: number;
  name: string;
  usuarioId?: number | null;
} */
@Component({
  selector: 'app-categories',
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
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  newCategory: Categoria = { name: '' };
  editingCategory: Categoria | null = null;
  categories: Categoria[] = [];
  dataSource = new MatTableDataSource<Categoria>([]);
  displayedColumns = ['name', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private toast: ToastrService,
    private dialog: MatDialog
  ) {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategoriesforUser().subscribe((cats) => {
      this.categories = cats.map((c) => ({
        id: c.id,
        name: c.nombre,
        usuarioId: c.usuarioId,
      }));
      this.dataSource.data = this.categories;
    });
  }

  submitCategory(form: NgForm) {
    const name = this.newCategory.name.trim();
    if (!name) return;

    if (this.isDuplicateName(name)) {
      this.toast.info('Ya existe una categoría con ese nombre');
      return;
    }

    if (this.editingCategory) {
      this.updateCategory(name, form);
    } else {
      this.addCategory(name, form);
    }
  }

  private addCategory(name: string, form: NgForm) {
    this.categoryService.createCategory({ nombre: name }).subscribe({
      next: () => {
        this.toast.success('Categoría creada con éxito', 'Éxito');
        this.afterSuccess(form);
      },
      error: (err) => this.showError(err, 'crear categoría'),
    });
  }

  private updateCategory(name: string, form: NgForm) {
    this.categoryService
      .updateCategory(this.editingCategory!.id!, { nombre: name })
      .subscribe({
        next: () => {
          this.toast.success('Categoría actualizada con éxito', 'Éxito');
          this.afterSuccess(form);
        },
        error: (err) => this.showError(err, 'editar categoría'),
      });
  }

  private isDuplicateName(name: string): boolean {
    return this.categories.some(
      (c) =>
        c.name.trim().toLowerCase() === name.toLowerCase() &&
        (!this.editingCategory || c.id !== this.editingCategory.id)
    );
  }

  private afterSuccess(form: NgForm) {
    this.loadCategories();
    this.resetForm(form);
  }

  private showError(error: any, context: string) {
    this.toast.error(error?.error?.message || `Error al ${context}`);
  }

  startEditCategory(categoria: Categoria, form: NgForm) {
    this.editingCategory = categoria;
    this.newCategory = { ...categoria };
    form.controls['categoryName']?.setValue(categoria.name);
  }

  cancelEdit(form: NgForm) {
    this.resetForm(form);
  }

  private resetForm(form: NgForm) {
    this.newCategory = { name: '' };
    this.editingCategory = null;
    form.resetForm();
  }

  deleteCategory(categoria: Categoria) {
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
          this.categoryService.deleteCategory(categoria.id!).subscribe({
            next: () => {
              this.loadCategories();
              this.toast.success('Categoría eliminada con éxito', 'Éxito');
            },
            error: (err) => this.showError(err, 'eliminar categoría'),
          });
        }
      });
  }
}
