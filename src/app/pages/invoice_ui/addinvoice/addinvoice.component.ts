import { InputTextModule } from 'primeng/inputtext';
import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { SplitButtonModule } from 'primeng/splitbutton';
import { AutoCompleteModule } from 'primeng/autocomplete';
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
import { ApplicationSettingService } from '../../service/application.setting.service';
import { ProductService } from '../../service/products.service';
import { InvoiceFormComponent } from '../../shared/invoice-form/invoice-form.component';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'app-addinvoice',
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
        DialogModule,
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
    clients: any[] = [];
    status: any[] = [];
    products: any[] = [];
    selectedProduct: any[] = [];

    invoiceForm!: FormGroup;
    nbInvioicesForm!: FormGroup;
    showsSubmitButton: boolean = true;
    settings: any;

    copied = false;
    showInputs = true;
    erreurInput = false;
    visible: boolean = false;

    nombreFactures: number[] = [];
    dividedInvoices: FormGroup[] = [];
    nbInvioices = 0;

    items: any[] = [];

    constructor(
        private fb: FormBuilder,
        private invoiceService: InvoiceService,
        private clientService: ClientService,
        private productService: ProductService,
        private appSetting: ApplicationSettingService,
        private messageService: MessageService,
        private router: Router,
    ) {
        this.invoiceForm = this.fb.group({
            HT: ['0.0'],
            TTC: ['0.0'],
            TVA: ['0.0'],
            PRECOMPTE: ['0.0'],
            client: [null, Validators.required],
            status: [null, Validators.required],
            avance: [null],
            echeance: [null],
            dateAdded: [null, Validators.required],
            lignes: this.fb.array([]),
        });
        this.nbInvioicesForm = this.fb.group({
            nbInvioices: [null, Validators.required],
        });
    }

    ngOnInit(): void {

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

        this.items = [
            {
                label: 'Diviser la facture',
                icon: 'pi pi-percentage',
                command: () => this.showDialog(),
            },
        ];
    }

    showDialog() {
        this.visible = true;
        this.generateDivisionOptions();
    }

    generateDivisionOptions() {
        const lignesPleines = this.getLignesPleines().length;
        this.nombreFactures = [];
        for (let i = 2; i <= lignesPleines; i++) {
            this.nombreFactures.push(i);
        }
    }

    getLignesPleines() {
        return (this.invoiceForm.get('lignes') as FormArray).controls.filter(
            (ligne) =>
                ligne.get('DESIGNATION')?.value && ligne.get('QUANTITY')?.value,
        );
    }

    navigateToDivision() {
        if (this.nbInvioicesForm.valid) {
            const nombreFactures =
                this.nbInvioicesForm.get('nbInvioices')?.value;
            const client = this.invoiceForm.get('client')?.value;
            const lignesPleines = this.getLignesPleines().map((l) => l.value);
            const status = this.invoiceForm.get('status')?.value;

            this.router.navigate(['/invoices/divide-invoice'], {
                state: {
                    client: client,
                    lignes: lignesPleines,
                    status: status,
                    nombreFactures: nombreFactures,
                },
            });
        } else {
            this.erreurInput = true;
            this.showError('Veuillez remplir le nombre de factures.');
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

    onInvoiceSubmitted() {
        const invoiceData = this.invoiceForm.getRawValue();

        this.invoiceService.addInvoice(invoiceData).subscribe({
            next:(response)=>{
                this.router.navigate(['/invoices/print-invoice'], {
                    state: {
                        invoice: invoiceData,
                        isOneInvoice: true,
                        code_facture: response.message.code_facture
                    },
                });
            },error:()=>{
                this.showError('Erreur inatendu !')
            }
        });

    }
}
