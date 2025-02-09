export interface CreditCardSummary {
  CreditCard: string;
  Months: { [key: string]: number };
  Total: number;
}