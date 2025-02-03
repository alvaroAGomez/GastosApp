import { Category } from "./category.model";

// expense.model.ts
export interface Expense {
    id: string;
    amount: number;
    date: Date;
    description: string;
    category: Category;
    installments?: number;
    remainingInstallments?: number;
    cardId: string;
  }