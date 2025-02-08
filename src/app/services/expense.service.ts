import { Injectable } from '@angular/core';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor() { }

  private expenses: Expense[] = [
    {
      id: 1, nameCard: 'Visa Platinum', category: 'Supermercado', amount: 15000, date: new Date(), description: 'Compras del mes',
      cardId: ''
    },
    {
      id: 2, nameCard: 'Mastercard Gold', category: 'Combustible', amount: 8500, date: new Date(new Date().setDate(new Date().getDate() + 2)), description: 'Carga de nafta',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
    {
      id: 3, nameCard: 'American Express', category: 'Restaurante', amount: 12500, date: new Date(new Date().setDate(new Date().getDate() + 5)), description: 'Cena con amigos',
      cardId: ''
    },
  ];

  getExpenses(): Expense[] {
    return this.expenses.sort((a, b) => b.id - a.id); // Ordenados de más nuevos a más viejos
  }
}
