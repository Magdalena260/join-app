import { Routes } from '@angular/router';
import { Contacts } from './pages/contacts/contacts';
import { Board } from './pages/board/board';
import { AddTask } from './pages/add-task/add-task';
import { AuthGuard } from './shared/components/auth-guard';

export const routes: Routes = [
  { path: 'contacts', component: Contacts, canActivate: [AuthGuard] },
  { path: 'board', component: Board, canActivate: [AuthGuard] },
  { path: 'contacts', component: Contacts, canActivate: [AuthGuard] },
  { path: 'add-task', component: AddTask, canActivate: [AuthGuard] },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];
