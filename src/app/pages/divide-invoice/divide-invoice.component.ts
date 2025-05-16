import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApplicationSettingService } from '../service/application.setting.service';
import { ClientService } from '../service/client.service';
import { InvoiceService } from '../service/invoice.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../service/products.service';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { InvoiceFormComponent } from '../shared/invoice-form/invoice-form.component';
import { FieldsetModule } from 'primeng/fieldset';
import { AppFooter } from '../../layout/component/app.footer';

@Component({
    selector: 'app-divide-invoice',
    imports: [
        CommonModule,
        SelectModule,
        InputTextModule,
        FormsModule,
        TableModule,
        DividerModule,
        BadgeModule,
        ButtonModule,
        SplitButtonModule,
        ReactiveFormsModule,
        AutoCompleteModule,
        InvoiceFormComponent,
        FieldsetModule,
        AppFooter,
    ],
    templateUrl: './divide-invoice.component.html',
    styleUrl: './divide-invoice.component.scss',
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
export class DivideInvoiceComponent implements OnInit {
    clients: any[] = [];
    client: any;
    selectedStatus: any;
    status: any[] = [];
    products: any[] = [];
    nombreFactures: number = 0;
    selectedProduct: any[] = [];
    dividedInvoices: FormGroup[] = [];
    lignesDividedInvoicesArray: FormArray[] = [];
    invoiceDevidedlignes!: FormArray;
    lignes: any = [];
    settings: any;
    Num: string = '';
    isReadonly: boolean = true;
    selectVariant = 'filled';

    copied = false;
    showInputs = true;
    erreurInput = false;
    visible: boolean = false;
    showsSubmitButton: boolean = false;

    constructor(
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private clientService: ClientService,
        private productService: ProductService,
        private appSetting: ApplicationSettingService,
        private messageService: MessageService,
        private router: Router,
    ) {
        const nav = this.router.getCurrentNavigation();
        const state = nav?.extras.state as any;

        this.client = state.client;
        this.lignes = state.lignes;
        this.nombreFactures = state.nombreFactures;
        this.selectedStatus = state.status;
        this.Num = state.num;
    }

    ngOnInit() {
        this.clientService.getAllClients().subscribe({
            next: (data: any) => (this.clients = data),
            error: (err: HttpErrorResponse) => this.showError(err.error.error),
        });

        this.productService.getAllProducts().subscribe({
            next: (data: any) => (this.products = data),
            error: (err: HttpErrorResponse) => this.showError(err.error.error),
        });

        this.settings = this.appSetting.settings;

        this.status = [
            { name: 'Payée', code: 0 },
            { name: 'Partiellement payée', code: 1 },
            { name: 'Impayée', code: 2 },
        ];

        const n = this.nombreFactures;
        const lignesParFacture = Math.floor(this.lignes.length / n);
        const surplus = this.lignes.length % n;

        let index = 0;

        for (let i = 0; i < n; i++) {
            const count = lignesParFacture + (i < surplus ? 1 : 0);
            const lignesPart = this.lignes.slice(index, index + count) as any[];

            const lignesArray = this.fb.array(
                lignesPart.map((l) => this.fb.group(l)),
            );

            const form = this.fb.group({
                num: [this.Num],
                client: [null, Validators.required],
                status: [null, Validators.required],
                avance: [null],
                echeance: [null],
                dateAdded: [null, Validators.required],
                HT: ['0.0'],
                TTC: ['0.0'],
                TVA: ['0.0'],
                ECOMP: ['0.0'],
                lignes: this.fb.array([]),
            });

            this.dividedInvoices.push(form);
            this.lignesDividedInvoicesArray.push(lignesArray);
            index += count;
        }
    }

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
        });
    }

    clearForm() {}

    backToListPage() {
        this.router.navigate(['/invoices/addinvoice']);
    }

    printAllFactures() {
        this.dividedInvoices.forEach((f) => f.markAllAsTouched());

        if (this.dividedInvoices.every((f) => f.valid)) {

            const invoiceData = this.dividedInvoices.map((f) => f.getRawValue());

            this.router.navigate(['/invoices/print-invoice'], {
                state: {
                    dividedInvoices: invoiceData
                },
            })
        } else {
            this.showError('Certains champs de vos factures sont invalides.');
        }
    }
}
