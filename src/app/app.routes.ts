import { Routes } from '@angular/router';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { Contacts } from './pages/contacts/contacts';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';

export const routes: Routes = [
  { path: 'contacts', component: Contacts },
  { path: 'board', component: Board },
  { path: 'add-task', component: AddTask },
  { path: 'sign-up', component: SignUp },
  { path: 'login', component: Login },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
import { AuthGuard } from './shared/components/auth-guard';

export const routes: Routes = [
  { path: 'contacts', component: Contacts, canActivate: [AuthGuard] },
  { path: 'board', component: Board, canActivate: [AuthGuard] },
  { path: 'contacts', component: Contacts, canActivate: [AuthGuard] },
  { path: 'add-task', component: AddTask, canActivate: [AuthGuard] },
  {path: '', redirectTo: '/login', pathMatch: 'full'},
];
