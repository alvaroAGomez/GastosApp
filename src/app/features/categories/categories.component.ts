import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
import { CategoryService } from '../../services/category.service';
import { ToastrService } from 'ngx-toastr';

interface Category {
  id?: number;
  name: string;
  usuarioId?: number | null;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  newCategory: Category = { name: '' };
  categories: Category[] = [];
  dataSource = new MatTableDataSource<Category>(this.categories);
  displayedColumns: string[] = ['name', 'actions'];

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

  addCategory(form: NgForm) {
    const name = this.newCategory.name.trim();
    if (!name) return;

    // Validar unicidad (no case sensitive)
    if (
      this.categories.some(
        (c) => c.name.trim().toLowerCase() === name.toLowerCase()
      )
    ) {
      alert('Ya existe una categoría con ese nombre');
      return;
    }

    this.categoryService.createCategory({ nombre: name }).subscribe({
      next: () => {
        this.loadCategories();
        form.resetForm();
        this.toast.success('Categoría creada con éxito', 'Éxito');
      },
      error: (err) => alert(err.error?.message || 'Error al crear categoría'),
    });
  }

  editCategory(category: Category) {
    const newName = prompt('Editar categoría', category.name);
    if (newName !== null && newName.trim() !== '') {
      // Validar unicidad (no case sensitive)
      if (
        this.categories.some(
          (c) =>
            c.id !== category.id &&
            c.name.trim().toLowerCase() === newName.trim().toLowerCase()
        )
      ) {
        this.toast.warning('Ya existe una categoría con ese nombre', 'Cuidado');
        return;
      }
      this.categoryService
        .updateCategory(category.id!, { nombre: newName.trim() })
        .subscribe({
          next: () => this.loadCategories(),
          error: (err) =>
            this.toast.error(err.error?.message || 'Error al editar categoría'),
        });
    }
  }

  deleteCategory(category: Category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar categoría',
        message: '¿Seguro que desea eliminar la categoría?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.categoryService.deleteCategory(category.id!).subscribe({
          next: () => this.loadCategories(),
          error: (err) =>
            this.toast.error(
              err.error?.message || 'Error al eliminar categoría'
            ),
        });
      }
    });
  }
}
