import { Category } from './category.model';
export interface Expense {
  id: number;
  monto: number;
  fecha: Date;
  descripcion: string;
  categoria: string;
  cuotas?: number;
  cuotasRestantes?: number;
  cardId: string;
  nameCard: string;
}
