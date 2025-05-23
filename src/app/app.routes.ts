import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CreditCardFormComponent } from './features/cards/credit-card-form/credit-card-form.component';
import { DebitCardFormComponent } from './features/cards/debit-card-form/debit-card-form.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { UpcomingExpensesComponent } from './features/expenses/upcoming-expenses/upcoming-expenses.component';
import { ReportsComponent } from './features/reports/reports.component';
import { accessGuard } from './guards/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DetailsComponent } from './features/cards/credit-card-form/credit-card-details/details.component';
import { HistoricoComponent } from './features/expenses/historico/historico.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [accessGuard(true)],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'credit-cards', component: CreditCardFormComponent },
      { path: 'credit-cards/:id', component: DetailsComponent },
      { path: 'historico', component: HistoricoComponent },
      { path: 'debit-cards', component: DebitCardFormComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'upcoming-expenses', component: UpcomingExpensesComponent },
      { path: 'categories', component: CategoriesComponent },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [accessGuard(false)],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [accessGuard(false)],
  },
];
