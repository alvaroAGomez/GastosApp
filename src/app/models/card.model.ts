import { Expense } from './expense.model';

// ...existing code...

export interface CreditCard {
  id: number;
  nombreTarjeta: string;
  numeroTarjeta: string;
  limiteCredito: number;
  cierreCiclo?: string; // o Date, según lo que devuelva el backend
  fechaVencimiento?: string; // o Date
  banco: { id: number; nombre: string }; // ajusta según tu entidad Banco
  gastos?: Expense[];
}

export interface CreditCardAnnualGeneralSummary {
  resumenMensual: { mes: string; totalGasto: number }[];
  totalAnual: number;
}

export interface CreditCardMonthlyDetail {
  mes: string;
  gastoActual: number;
  montoCuotas: number;
  totalMes: number;
}

export interface CreditCardMonthlyDetailSummary {
  tarjetaId: number;
  nombreTarjeta: string;
  anio: number;
  resumenMensual: CreditCardMonthlyDetail[];
  totalAnual: number;
}

// DTO para crear tarjeta
export interface CreateCreditCardDTO {
  nombreTarjeta: string;
  numeroTarjeta: string;
  limiteCredito: number;
  cierreCiclo?: string;
  fechaVencimiento?: string;
  bancoId: number;
}

// DTO para actualizar tarjeta
export interface UpdateCreditCardDTO {
  nombreTarjeta?: string;
  numeroTarjeta?: string;
  limiteCredito?: number;
  cierreCiclo?: string;
  fechaVencimiento?: string;
  bancoId?: number;
}
