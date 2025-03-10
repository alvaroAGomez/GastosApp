import { Category } from "./category.model";
export interface Expense {
    id: number;
    amount: number;
    date: Date;
    description: string;
    category: Category|string;
    installments?: number;
    remainingInstallments?: number;
    cardId: string;
    nameCard: string;
  }

  