import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Accueil',
                items: [{ label: 'Tableau de bord', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Gestion du stock',
                        icon: 'pi pi-box',
                        items: [
                            {
                                label: 'Nouvel article',
                                icon: 'pi pi-plus',
                                routerLink: ['/products/addproduct']
                            },
                            {
                                label: 'Les articles',
                                icon: 'pi pi-list',
                                routerLink: ['/products/productslist']
                            }
                        ]
                    },
                    {
                        label: 'Gestion de la clientèle',
                        icon: 'pi pi-money-bill',
                        items: [
                            {
                                label: 'Nouveau client',
                                icon: 'pi pi-plus',
                                routerLink: ['/clients/addclient']
                            },
                            {
                                label: 'Les clients',
                                icon: 'pi pi-list',
                                routerLink: ['/clients/clientslist']
                            }
                        ]
                    },
                    {
                        label: 'Gestion de employés',
                        icon: 'pi pi-users',
                        items: [
                            {
                                label: 'Nouvel employé',
                                icon: 'pi pi-plus',
                                routerLink: ['/employees/addemployee']
                            },
                            {
                                label: 'Les employés',
                                icon: 'pi pi-list',
                                routerLink: ['/employees/employeeslist']
                            }
                        ]
                    },
                    {
                        label: 'Gestion des factures',
                        icon: 'pi pi-receipt',
                        items: [
                            {
                                label: 'Nouvel facture',
                                icon: 'pi pi-plus',
                                routerLink: ['/invoices/addinvoice']
                            },
                            {
                                label: 'Les factures',
                                icon: 'pi pi-list',
                                routerLink: ['/invoices/invoiceslist']
                            }
                        ]
                    },
                    {
                        label: 'Gestion des fournisseurs',
                        icon: 'pi pi-truck',
                        items: [
                            {
                                label: 'Nouveau fournisseur',
                                icon: 'pi pi-plus',
                                routerLink: ['/suppliers/addsupplier']
                            },
                            {
                                label: 'Les fournisseurs',
                                icon: 'pi pi-list',
                                routerLink: ['/suppliers/supplierslist']
                            }
                        ]
                    }
                ]
            },
            {
                label: 'Autres',
                items: [{ label: 'Paramètres', icon: 'pi pi-cog', routerLink: ['/settings'] }]
            }
        ];
    }
}
