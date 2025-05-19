export interface Gasto {
  id?: number;
  monto: number;
  fecha: Date | string;
  descripcion: string;
  categoriaGastoId: number;
  tarjetaCreditoId?: number;
  tarjetaDebitoId?: number;
  esEnCuotas: boolean;
  numeroCuotas?: number;
}
