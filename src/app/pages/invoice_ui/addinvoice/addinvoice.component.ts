import { InputTextModule } from 'primeng/inputtext';
import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { Clientdata } from '../../client_ui/clientdata';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { SplitButtonModule } from 'primeng/splitbutton';
import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { ButtonModule } from 'primeng/button';
import { InvoiceService } from '../../service/invoice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { ClientService } from '../../service/client.service';

@Component({
    selector: 'app-addinvoice',
    imports: [
        CommonModule,
        SelectModule,
        InputIcon,
        IconField,
        InputTextModule,
        FormsModule,
        DatePicker,
        TableModule,
        DividerModule,
        BadgeModule,
        ButtonModule,
        SplitButtonModule,
    ],
    templateUrl: './addinvoice.component.html',
    styleUrl: './addinvoice.component.scss',
    animations: [
        trigger('slideToggle', [
            state(
                'visible',
                style({ height: '*', opacity: 1, overflow: 'visible' }),
            ),
            state(
                'hidden',
                style({ height: '0px', opacity: 0, overflow: 'hidden' }),
            ),
            transition('visible <=> hidden', [animate('300ms ease-in-out')]),
        ]),
    ],
})
export class AddinvoiceComponent implements OnInit {
    clients: any[] | undefined;
    types: any[] | undefined;
    status: any[] | undefined;
    date: Date | undefined;

    selectedClient: any | undefined;
    selectedStatus: any | undefined;
    value2: any;
    totalHT: any;
    ecomp: any;
    tva: any;
    ttc: any;
    lignes: any[] = [
        { designation: '', quantite: '', puh: '', pth: '', pvc: '' },
    ];
    copied = false;
    showInputs = true;
    items: any[] = [];
    Num: string = '';
    visibleCountStatus = 4;
    visibleCountTva = 4;

    constructor(
        private invoiceService: InvoiceService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private clientService: ClientService,
    ) {}

    ngOnInit(): void {
        this.invoiceService.getInvoiceCode().subscribe({
            next: (data: any) => {
                this.Num = data.message;
                console.log('Num:', data.message);
            },
            error: (error: HttpErrorResponse) => {
                this.showError(error.error.error);
            },
        });

        this.clientService.getAllClients().subscribe({
            next: (data: any) => {
                this.clients = data;
            },
            error: (error: HttpErrorResponse) => {
                this.showError(error.error.error);
            },
        });

        this.status = [
            { name: 'Payée', code: 0 },
            { name: 'Partiellement payée', code: 1 },
            { name: 'Impayée', code: 2 },
        ];

        this.items = [
            {
                label: 'Diviser la facture',
                icon: 'pi pi-percentage',
            },
        ];
    }

    copyToClipboard(text: string) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                this.copied = true;
                setTimeout(() => (this.copied = false), 2000);
            })
            .catch((err) => {
                console.error('Erreur lors de la copie :', err);
            });
    }

    toggleInputs() {
        this.showInputs = !this.showInputs;
    }

    ajouterLigneSiNecessaire(index: number) {
        // Vérifie si la dernière ligne a été modifiée
        const derniereLigne = this.lignes[this.lignes.length - 1];
        if (
            derniereLigne.designation ||
            derniereLigne.quantite ||
            derniereLigne.puh ||
            derniereLigne.pth ||
            derniereLigne.pvc
        ) {
            this.lignes.push({
                designation: '',
                quantite: '',
                puh: '',
                pth: '',
                pvc: '',
            });
        }
    }

    supprimerLigne(index: number) {
        if (this.lignes.length > 1) {
            this.lignes.splice(index, 1);
        }
    }

    // Méthodes pour afficher les messages
    showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: message,
        });
    }

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
        });
    }

    updatevisibleCountStatus() {
        this.visibleCountStatus = 1;

        if (!this.selectedStatus || this.selectedStatus.code === 1) {
            this.visibleCountStatus += 1;
        }

        if (!this.selectedStatus || this.selectedStatus.code !== 0) {
            this.visibleCountStatus += 1;
        }

        this.visibleCountStatus += 1;
    }

    updatevisibleCountTva(){
        this.visibleCountTva = 1;

        if (!this.selectedClient || this.selectedClient?.concern_ecomp) {
            this.visibleCountTva += 1;
        }

        if (!this.selectedClient || this.selectedClient?.assujetti_tva ) {
            this.visibleCountTva += 1;
        }

        this.visibleCountTva += 1;
    }
}
