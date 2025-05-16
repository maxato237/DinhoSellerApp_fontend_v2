import { Component} from '@angular/core';
import { FactureComponent } from '../shared/facture/facture.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';


@Component({
    selector: 'app-print-invoice',
    imports: [CommonModule, FactureComponent],
    templateUrl: './print-invoice.component.html',
    styleUrl: './print-invoice.component.scss',
})
export class PrintInvoiceComponent{
    showfactureModel: boolean = false;
    dividedInvoices: any[] = [];

    constructor(private router: Router,private messageService: MessageService,) {
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras?.state as any;

        if (!state || !state.dividedInvoices) {
            this.showError("Erreur: nous n\'arrivons pas imprimer vos factures");
            return;
        }

        this.dividedInvoices = state.dividedInvoices;

        setTimeout(() => {
            window.print();
        }, 300);
    }

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
        });
    }
}
