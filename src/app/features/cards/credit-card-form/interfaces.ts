export interface CreditCardSummary {
  Id: number;
  CreditCard: string;
  Months: { [key: string]: number };
  Total: number;
  banco?: string;
}

export interface CuotaPendienteDetalle {
  gastoId: number;
  descripcion: string;
  fechaGasto: string;
  montoCuota: number;
  cuotasPendientes: number;
  totalFaltante: number;
}

export interface CuotasPendientesFuturasResponse {
  detalles: CuotaPendienteDetalle[];
  totalGeneral: number;
}

export interface GastoMensual {
  gastoId: number;
  fecha: string;
  descripcion: string;
  categoria: string;
  monto: number;
  cuota: string;
}
