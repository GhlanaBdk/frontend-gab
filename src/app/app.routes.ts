import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { DepositComponent } from './pages/deposit/deposit.component';
import { HistoryComponent } from './pages/history/history.component';
import { ChequebookComponent } from './pages/chequebook/chequebook.component';
import { TransferComponent } from './pages/transfer/transfer.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminAccountsComponent } from './pages/admin/admin-accounts/admin-accounts.component';
import { AdminCardsComponent } from './pages/admin/admin-cards/admin-cards.component';
import { AdminTransactionsComponent } from './pages/admin/admin-transactions/admin-transactions.component';
import { AdminChequebookComponent } from './pages/admin/admin-chequebook/admin-chequebook.component';
import { AdminGabsComponent } from './pages/admin/admin-gabs/admin-gabs.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'deposit', component: DepositComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'chequebook', component: ChequebookComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/accounts', component: AdminAccountsComponent },
  { path: 'admin/cards', component: AdminCardsComponent },
  { path: 'admin/transactions', component: AdminTransactionsComponent },
  { path: 'admin/chequebook', component: AdminChequebookComponent },
  { path: 'admin/gabs', component: AdminGabsComponent },
  { path: '**', redirectTo: 'login' }
];