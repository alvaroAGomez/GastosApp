import { Expense } from "./expense.model";

// card.model.ts
export type CardType = 'credit' | 'debit';

export interface Card {
  id: number;
  name: string;
  type: CardType;
  balance: number;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
  expenses?: Expense[];  // Hacer opcional con ?
}

// Tipo para creación
export type CreateCardDTO = Omit<Card, 'id'> & {
  expenses?: Expense[];
};

export interface CreditCard {
  id: number;
  name: string;
  amount: number;
}