import { Pipe, PipeTransform } from '@angular/core';
import { formatCurrency, getCurrencySymbol } from '@angular/common';

@Pipe({
  name: 'customCurrency',
  standalone: true,
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(
    value: number | string | null | undefined,
    decimals: number = 2
  ): string {
    // Convierte a número si es string
    let num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num as number) || num == null) num = 0;

    // Formato: $1.000,00 (peso argentino, símbolo angosto)
    return formatCurrency(
      num,
      'es-AR',
      getCurrencySymbol('ARS', 'narrow'),
      'ARS',
      `1.${decimals}-${decimals}`
    );
  }
}
