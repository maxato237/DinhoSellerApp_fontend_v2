import { Routes } from '@angular/router';
import { Access } from './access';
import { Login } from './login';
import { Error } from './error';
import { superadminGuard } from '../guards/superadmin.guard';

export default [
    { path: 'access', component: Access },
    { path: 'error', component: Error },
    { path: 'signin', component: Login, canActivate: [superadminGuard] },
] as Routes;
