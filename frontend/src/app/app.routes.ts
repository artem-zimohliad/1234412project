import { Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CrudFormComponent } from './crud-form/crud-form.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component'; 

export const routes: Routes = [
  { path: 'crud', component: CrudFormComponent },
  { path: 'user', component: UserFormComponent },
  { path: 'user/:key', component: UserDetailComponent},
  { path: '', redirectTo: '/user', pathMatch: 'full' },
];
