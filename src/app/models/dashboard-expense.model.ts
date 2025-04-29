export interface DashboardExpense {
  id: number;
  tarjeta: string;
  categoria: string;
  monto: number;
  fecha: string | Date;
  descripcion: string;
  // --- campos para edición ---
  categoriaGastoId?: number | null;
  tarjetaCreditoId?: number | null;
  tarjetaDebitoId?: number | null;
  cuotas?: number | null;
  esEnCuotas?: boolean;
}
