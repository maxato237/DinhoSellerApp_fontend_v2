import { InputTextModule } from 'primeng/inputtext';
import { Component, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
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
import Fuse from 'fuse.js';

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
        ReactiveFormsModule,
        AutoCompleteModule,
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

    selectedClient: any | undefined;
    selectedStatus: any | undefined;
    totalHT: any;
    ecomp: any;
    tva: any;
    ttc: any;
    copied = false;
    showInputs = true;
    items: any[] = [];
    Num: string = '';
    visibleCountStatus = 4;
    visibleCountTva = 4;
    invoiceForm!: FormGroup;
    erreurInput = false;
    responseError: any;

    HT = 'Total hors taxe';
    TVA = 'Total TVA';
    TTC = 'Total avec Taxe';
    ECOMP = "Réduction avant l'écheance";
    TotalSimple: number[] = [];
    TotalAvecTaxe: number[] = [];
    TotalEcomp: number[] = [];
    TotalTva: number[] = [];
    settings: any;
    products: any[] = [];
    selectedProduct: any[] = [];

    constructor(
        private invoiceService: InvoiceService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private clientService: ClientService,
        private appSetting: ApplicationSettingService,
        private productService: ProductService,
    ) {
        const lignesArray: FormArray = this.fb.array([]);
        lignesArray.push(this.createInvoiceLineFormGroup(lignesArray));

        this.invoiceForm = this.fb.group({
            num: [''],
            client: [null, Validators.required],
            status: [null, Validators.required],
            avance: [null],
            echeance: [null],
            dateAdded: [null, Validators.required],
            lignes: lignesArray,
        });
    }

    ngOnInit(): void {
        this.invoiceService.getInvoiceCode().subscribe({
            next: (data: any) => {
                this.Num = data.message;
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
        this.productService.getAllProducts().subscribe({
            next: (response) => {
                this.products = response;
            },
            error: (error: HttpErrorResponse) => {
                this.showError(error.error.error);
            },
        });

        this.settings = this.appSetting.settings;
        console.log(this.settings);
    }

    createInvoiceLineFormGroup(lignes: FormArray): FormGroup {
        const group = this.fb.group({
            DESIGNATION: [null],
            QUANTITY: [null],
            PUH: [null as number | null], // Prix unitaire hors taxe (net)
            PTH: [null as number | null], // Prix toutes taxes hors TVA
            PVC: [null as number | null], // Prix de vente TTC ou client
        });

        // Validator personnalisé
        group.get('DESIGNATION')?.setValidators([this.uniqueDesignationValidator(lignes)]);

        // Lorsque la désignation change
        group.get('DESIGNATION')?.valueChanges.subscribe((value: any) => {
            const matchingProduct = this.selectedProduct.find(p => p.name === value);

            if (!matchingProduct) {
                group.get('PUH')?.reset();
                group.get('PTH')?.reset();
                group.get('PVC')?.reset();
            } else {
                const basePrice = matchingProduct.price;
                const ecomp = this.settings.ECOMP || 0;
                const tva = this.settings.TVA || 0;
                const pvcRate = this.settings.PVC || 0;

                const netPUH = basePrice - (basePrice * ecomp);
                const pth = netPUH + (netPUH * tva);
                const pvc = netPUH + (netPUH * pvcRate);

                group.get('PUH')?.setValue(netPUH, { emitEvent: false });
                group.get('PTH')?.setValue(pth, { emitEvent: false });
                group.get('PVC')?.setValue(pvc, { emitEvent: false });
            }
        });

        // Lorsqu'une valeur change (quantité ou PUH)
        group.valueChanges.subscribe(() => {
            this.recalculateTotals(lignes);
        });

        (group as any).triggered = false;
        return group;
    }

    recalculateTotals(lignes: FormArray) {
        let totalHT = 0;
        let totalEcomp = 0;
        let totalTVA = 0;
        let totalTTC = 0;

        lignes.controls.forEach((lineGroup) => {
            const group = lineGroup as FormGroup;
            const value = lineGroup.value;
            const quantity = value.QUANTITY || 0;
            const pu_ht = value.PUH || 0;

            if (!quantity || !pu_ht) {
                return;
            }

            const brut = quantity * pu_ht;
            const ecomp = brut * (this.settings.ECOMP || 0);
            const netHT = brut - ecomp;
            const tva = netHT * (this.settings.TVA || 0);
            const ttc = netHT + tva;

            totalHT += netHT;
            totalEcomp += ecomp;
            totalTVA += tva;
            totalTTC += ttc;
        });

        this.HT = totalHT.toFixed(2);
        this.ECOMP = totalEcomp.toFixed(2);
        this.TVA = totalTVA.toFixed(2);
        this.TTC = totalTTC.toFixed(2);
    }


    get all_lignes() {
        return this.invoiceForm.get('lignes') as FormArray;
    }

    ajouterLigneSiNecessaire(index: number) {
        const lignes = this.all_lignes; // alias pour clarté
        const derniereLigne = lignes.at(index) as any;

        if (derniereLigne.triggered) {
            return;
        }

        const hasValue = ['DESIGNATION', 'QUANTITY', 'PUH', 'PTH', 'PVC'].some(
            (field) => derniereLigne.get(field)?.value !== '',
        );

        if (hasValue) {
            derniereLigne.triggered = true;

            const dernierIndex = lignes.length - 1;
            const derniereValeur = lignes.at(dernierIndex);
            const lastHasValue = [
                'DESIGNATION',
                'QUANTITY',
                'PUH',
                'PTH',
                'PVC',
            ].some((field) => derniereValeur.get(field)?.value !== '');

            if (lastHasValue) {
                lignes.push(this.createInvoiceLineFormGroup(lignes));
            }
        }
    }

    autofindname(event: any) {
        let designation = event.query;

        const options = {
            keys: ['name'],
            threshold: 0.3,
            ignoreLocation: true,
            includeScore: true,
        };

        const fuse = new Fuse(this.products, options);
        const resultats = fuse.search(designation);

        this.selectedProduct = resultats.map((r) => r.item);
    }

    autoaddprices(index: number) {
        let lignes = this.invoiceForm.get('lignes') as FormArray;
        let ligne = lignes.at(index) as FormGroup;
        let product = ligne.get('DESIGNATION')?.value;
        ligne.get('PUH')?.setValue(product.price);
        ligne.get('PTH')?.setValue(product.price + product.price * this.settings.TVA);
        ligne.get('PVC')?.setValue(product.price + product.price * this.settings.PVC);
    }

    submit() {
        if (this.invoiceForm.valid) {
            this.invoiceForm.get('num')?.setValue(this.Num);
            console.log(this.invoiceForm.value);
        } else {
            this.erreurInput = true;
            this.showError('Formulaire invalide !');
        }
    }

    clearForm() {
        this.invoiceForm.reset();
        const lignes = this.invoiceForm.get('lignes') as FormArray;
        lignes.clear();
        lignes.push(this.createInvoiceLineFormGroup(lignes));
        this.erreurInput = false;
        this.showInputs = true;
        this.TTC = '';
        this.HT = '';
        this.TVA = '';
        this.ECOMP = '';
        this.TotalSimple = [];
        this.TotalAvecTaxe = [];
        this.TotalEcomp = [];
        this.TotalTva = [];
        this.copied = false;
    }

    uniqueDesignationValidator(formArray: FormArray): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (!control || !control.value) return null;

            const currentDesignation = control.value;
            const duplicates = formArray.controls.filter(
                (ctrl) => ctrl.get('DESIGNATION')?.value === currentDesignation,
            );

            if (duplicates.length > 1) {
                control.setValue('');
                this.showError(currentDesignation.name + ' existe déjà !');
                return { duplicateDesignation: true };
            }

            return null;
        };
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

    supprimerLigne(index: number) {
        let lignes = this.invoiceForm.get('lignes') as FormArray;
        // lignes.at(index).get('DESIGNATION')?.setValue('');
        // lignes.at(index).get('QUANTITY')?.setValue('');
        // lignes.at(index).get('PUH')?.setValue('');
        // lignes.at(index).get('PTH')?.setValue('');
        // lignes.at(index).get('PVC')?.setValue('');
        if (this.all_lignes.length > 1) {
            this.all_lignes.removeAt(index);
        }
    }

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

    updatevisibleCountTva() {
        this.visibleCountTva = 1;

        if (!this.selectedClient || this.selectedClient?.concern_ecomp) {
            this.visibleCountTva += 1;
        }

        if (!this.selectedClient || this.selectedClient?.assujetti_tva) {
            this.visibleCountTva += 1;
        }

        this.visibleCountTva += 1;
    }
}
