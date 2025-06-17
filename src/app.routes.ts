import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { NotfoundComponent } from './app/pages/notfound/notfound.component';
import { SettingsComponent } from './app/pages/settings/settings.component';
import { SetupComponent } from './app/pages/setup/setup.component';
import { authGuard } from './app/pages/guards/auth.guard';
import { DivideInvoiceComponent } from './app/pages/invoice_ui/divide-invoice/divide-invoice.component';
import { PrintInvoiceComponent } from './app/pages/print-invoice/print-invoice.component';


export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivateChild: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'settings', component: SettingsComponent },
            { path: 'clients', loadChildren: () => import('./app/pages/client_ui/client.routes') },
            { path: 'employees', loadChildren: () => import('./app/pages/employee_ui/employee.routes') },
            { path: 'invoices', loadChildren: () => import('./app/pages/invoice_ui/invoice.routes') },
            { path: 'products', loadChildren: () => import('./app/pages/product_ui/product.routes') },
            { path: 'suppliers', loadChildren: () => import('./app/pages/supplier_ui/supplier.routes') },
        ]
    },
    { path: 'notfound', component: NotfoundComponent },
    { path: 'invoices/print-invoice', component: PrintInvoiceComponent,canActivateChild: [authGuard] },
    { path: 'setup', component: SetupComponent },
    { path: 'invoices/divide-invoice', component: DivideInvoiceComponent, canActivate: [authGuard] },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
