import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

interface Category {
  name: string;
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
    MatIconModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  newCategory: Category = { name: '' };
  // Inicializamos la lista con una categoría de ejemplo
  categories: Category[] = [{ name: 'test' }];
  // Creamos el dataSource basado en la lista
  dataSource = new MatTableDataSource<Category>(this.categories);
  // La tabla tendrá dos columnas: nombre y acciones
  displayedColumns: string[] = ['name', 'actions'];

  addCategory(form: NgForm) {
    // Solo agrega si hay texto (quitando espacios en blanco)
    if (this.newCategory.name.trim()) {
      // Agregamos la categoría al arreglo
      this.categories.push({ name: this.newCategory.name.trim() });
      // Actualizamos el dataSource para que la tabla se refresque
      this.dataSource.data = this.categories;
      // Reiniciamos el formulario (esto limpia el input y resetea su estado)
      form.resetForm();
    }
  }

  editCategory(category: Category) {
    const newName = prompt('Editar categoría', category.name);
    if (newName !== null && newName.trim() !== '') {
      category.name = newName.trim();
      // Actualizamos el dataSource para reflejar el cambio en la tabla
      this.dataSource.data = this.categories;
    }
  }

  deleteCategory(category: Category) {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      this.categories.splice(index, 1);
      // Actualizamos el dataSource para que la tabla se refresque
      this.dataSource.data = this.categories;
    }
  }
}
