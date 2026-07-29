import { Routes } from '@angular/router';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { Contacts } from './pages/contacts/contacts';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { Summary } from './pages/summary/summary';
import { AuthGuard } from './shared/components/auth-guard';
import { LegalNotice } from './shared/components/legal-notice/legal-notice';
import { PrivacyPolicy } from './shared/components/privacy-policy/privacy-policy';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'sign-up', component: SignUp },

  { path: '', component: Summary },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'legal-notice', component: LegalNotice },

  { path: 'contacts', component: Contacts, canActivate: [AuthGuard] },
  { path: 'board', component: Board, canActivate: [AuthGuard] },
  { path: 'add-task', component: AddTask, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

