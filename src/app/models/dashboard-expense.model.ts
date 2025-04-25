export interface DashboardExpense {
  id: number;
  tarjeta: string;
  categoria: string;
  monto: number;
  fecha: string | Date;
  descripcion: string;
}
