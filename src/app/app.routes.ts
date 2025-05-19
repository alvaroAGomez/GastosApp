import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { CreditCardFormComponent } from './features/cards/credit-card-form/credit-card-form.component';
import { DebitCardFormComponent } from './features/cards/debit-card-form/debit-card-form.component';
import { CategoriaComponent } from './features/categoria/categoria.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { NuevoGastoComponent } from './features/expenses/nuevo-gasto/nuevo-gasto.component';
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
      { path: 'categorias', component: CategoriaComponent },
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
