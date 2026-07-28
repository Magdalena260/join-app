import { Routes } from '@angular/router';
import { AddTask } from './pages/add-task/add-task';
import { Board } from './pages/board/board';
import { Contacts } from './pages/contacts/contacts';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { Summary } from './pages/summary/summary';
import { LegalNotice } from './shared/components/legal-notice/legal-notice';
import { PrivacyPolicy } from './shared/components/privacy-policy/privacy-policy';

export const routes: Routes = [
  { path: 'contacts', component: Contacts },
  { path: 'board', component: Board },
  { path: 'add-task', component: AddTask },
  { path: 'summary', component: Summary },
  { path: 'sign-up', component: SignUp },
  { path: 'login', component: Login },
  { path: 'privacy-policy', component: PrivacyPolicy },
  { path: 'legal-notice', component: LegalNotice },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
