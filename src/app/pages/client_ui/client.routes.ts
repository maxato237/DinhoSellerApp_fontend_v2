import { Routes } from '@angular/router';
import { AddclientComponent } from './addclient/addclient.component';
import { ClientslistComponent } from './clientslist/clientslist.component';

export default [
    { path: 'addclient', component: AddclientComponent },
    { path: 'clientslist', component: ClientslistComponent },
] as Routes;

