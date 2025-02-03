import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'credit-cards',
    loadComponent: () => import('./features/cards/credit-card-form/credit-card-form.component').then(m => m.CreditCardFormComponent)
  },
  {
    path: 'debit-cards',
    loadComponent: () => import('./features/cards/debit-card-form/debit-card-form.component').then(m => m.DebitCardFormComponent)
  },
  {
    path: 'reports/:cardId',
    loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'categories',
    loadComponent: () => import('./features/categories/categories.component').then(m => m.CategoriesComponent)
  },
  {
    path: 'upcoming-expenses',
    loadComponent: () => import('./features/expenses/upcoming-expenses/upcoming-expenses.component').then(m => m.UpcomingExpensesComponent)
  }
];