import { Component, ElementRef, ViewChild} from '@angular/core';
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
    invoice: any;
    isOneInvoice!: boolean;
    code_facture: any;
    dividedInvoices: any[] = [];
    @ViewChild('pdfContent', { static: false }) pdfContentRef!: ElementRef;

    constructor(private router: Router,private messageService: MessageService,) {
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras?.state as any;

        if (!state) {
            this.showError("Erreur: nous n\'arrivons pas imprimer");
            return;
        }

        this.isOneInvoice = state.isOneInvoice;
        this.code_facture = state.code_facture;

        if(this.isOneInvoice){
            this.invoice = state.invoice;
        }else{
            this.dividedInvoices = state.dividedInvoices;
        }

    }

    ngAfterViewInit(): void {
        setTimeout(() => {
          window.print()
        }, 500);
    }

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
        });
    }
}
