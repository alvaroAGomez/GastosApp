import { Category } from './category.model';
export interface Expense {
  id?: number;
  monto: number;
  fecha: Date | string;
  descripcion: string;
  categoriaGastoId: number;
  tarjetaCreditoId?: number;
  tarjetaDebitoId?: number;
  esEnCuotas: boolean;
  numeroCuotas?: number;
  mesPrimerPago: Date | undefined;
}
