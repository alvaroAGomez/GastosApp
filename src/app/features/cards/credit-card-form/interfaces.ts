export interface CreditCardSummary {
  Id: number;
  CreditCard: string;
  Months: { [key: string]: number };
  Total: number;
  banco?: string;
}
