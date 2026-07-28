import { Routes } from '@angular/router';
import { Contacts } from './pages/contacts/contacts';
import { Board } from './pages/board/board';
import { AddTask } from './pages/add-task/add-task';
import { Summary } from './pages/summary/summary';
import { PrivacyPolicy } from './shared/components/privacy-policy/privacy-policy';
import { LegalNotice } from './shared/components/legal-notice/legal-notice';


export const routes: Routes = [
  { path: '', component: Summary},
  { path: 'contacts', component: Contacts },
  { path: 'board', component: Board },
  { path: 'add-task', component: AddTask },
  { path: 'privacy-policy', component: PrivacyPolicy },
  {path: 'legal-notice', component: LegalNotice},
];
