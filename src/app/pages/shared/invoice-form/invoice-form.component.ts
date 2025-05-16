import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormGroup,
    ValidatorFn,
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import Fuse from 'fuse.js';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { DividerModule } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-invoice-form',
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
    templateUrl: './invoice-form.component.html',
    styleUrl: './invoice-form.component.scss',
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
export class InvoiceFormComponent implements OnInit {
    // Inputs provenant du parent
    @Input() form!: FormGroup;
    @Input() clients: any[] = [];
    @Input() client: any;
    @Input() isReadonly!: boolean;
    @Input() selectVariant!: any;
    @Input() showsSubmitButton!: boolean;
    @Input() products: any[] = [];
    @Input() invoiceDevidedlignes!: FormArray;
    @Input() selectedProduct: any[] = [];
    @Input() status: any[] = [];
    @Input() divisedstatus: any;
    @Input() settings: any;
    @Input() showInputs: boolean = true;
    @Input() erreurInput: boolean = false;
    @Input() copied: boolean = false;
    @Input() items: any[] = [];

    @Output() submitted = new EventEmitter<void>();
    @Output() cleared = new EventEmitter<void>();
    @Output() error = new EventEmitter<string>();

    // Champs calculés

    visibleCountStatus = 4;
    visibleCountTva = 4;

    constructor(private fb: FormBuilder) {}

    ngOnInit(): void {
        const lignes = this.form.get('lignes') as FormArray;
        lignes.push(this.createInvoiceLineFormGroup(lignes));

        if (this.invoiceDevidedlignes?.length > 0) {
            lignes.clear();
            for (let i = 0; i < this.invoiceDevidedlignes.length; i++) {
                const sourceLigne = this.invoiceDevidedlignes.at(i);

                const newLigne = this.createInvoiceLineFormGroup(lignes);
                newLigne.patchValue(sourceLigne.value);

                const hasValue = [
                    'DESIGNATION',
                    'QUANTITY',
                    'PUH',
                    'PTH',
                    'PVC',
                ].some((field) => newLigne.get(field)?.value);
                (newLigne as any).triggered = hasValue;

                lignes.push(newLigne);
            }
            lignes.push(this.createInvoiceLineFormGroup(lignes));
        }

        if (this.client) {
            const clientControl = this.form.get('client');

            clientControl?.reset();
            clientControl?.setValue({ ...this.client });

            this.handleClientChange({ value: this.client });
        }
        if (this.divisedstatus) {
            this.form.get('status')?.patchValue(this.divisedstatus);
            this.updatevisibleCountStatus();
        }
    }

    get all_lignes(): FormArray {
        return this.form.get('lignes') as FormArray;
    }

    getLignes(): FormGroup[] {
        return this.all_lignes.controls as FormGroup[];
    }

    private updatePriceFieldsForProduct(
        group: FormGroup,
        product: any,
        client: any,
        settings: any,
    ): void {
        const basePrice = product.price;
        const ecomp = settings.ECOMP || 0;
        const tva = settings.TVA || 0;
        const pvcRate = settings.PVC || 0;

        const basePUH: number = basePrice - basePrice * ecomp;
        const clientDiscountPUH = basePUH * (client?.specific_price || 0);
        const netPUH: number = basePUH - clientDiscountPUH;
        const pth = netPUH + netPUH * tva;
        const pvc = netPUH + netPUH * pvcRate;

        group.get('PUH')?.setValue(netPUH.toFixed(2), { emitEvent: false });
        group.get('PTH')?.setValue(pth.toFixed(2), { emitEvent: false });
        group.get('PVC')?.setValue(pvc.toFixed(2), { emitEvent: false });
    }

    createInvoiceLineFormGroup(lignes: FormArray): FormGroup {
        const group = this.fb.group({
            DESIGNATION: [null],
            QUANTITY: [null],
            PUH: [null as number | null],
            PTH: [null as number | null],
            PVC: [null as number | null],
        });

        group
            .get('DESIGNATION')
            ?.setValidators([this.uniqueDesignationValidator(lignes)]);

        group.get('DESIGNATION')?.valueChanges.subscribe((value: any) => {
            const matchingProduct = this.selectedProduct.find(
                (p) => p.name === value,
            );

            if (!matchingProduct) {
                group.get('PUH')?.reset();
                group.get('PTH')?.reset();
                group.get('PVC')?.reset();
            } else {
                const client = this.form.get('client')?.value;
                this.updatePriceFieldsForProduct(
                    group,
                    matchingProduct,
                    client,
                    this.settings,
                );
            }
            this.recalculateTotals(lignes);
        });

        group.get('QUANTITY')?.valueChanges.subscribe(() => {
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
            const quantity = lineGroup.get('QUANTITY')?.value || 0;
            const product = lineGroup.get('DESIGNATION')?.value;
            const netpuh = lineGroup.get('PUH')?.value || 0;
            const netpth = lineGroup.get('PTH')?.value || 0;

            if (!quantity || !netpuh) return;

            const netHT = quantity * netpuh;
            const netTTC = quantity * netpth;
            const ecomp = product.price * (this.settings.ECOMP || 0);

            const tva = netpuh * (this.settings.TVA || 0);

            totalHT += netHT;
            totalEcomp += ecomp;
            totalTVA += tva;
            totalTTC += netTTC;
        });

        this.form.get('HT')?.setValue(totalHT.toFixed(2))
        this.form.get('ECOMP')?.setValue(totalEcomp.toFixed(2))
        this.form.get('TVA')?.setValue(totalTVA.toFixed(2))
        this.form.get('TTC')?.setValue(totalTTC.toFixed(2))
    }

    reapplyPricingToAllLines(client: any) {
        // const lignes = this.form.get('lignes') as FormArray;
        const lignes = this.all_lignes;

        lignes.controls.forEach((lineGroup) => {
            const designation = lineGroup.get('DESIGNATION')?.value;
            const puh = lineGroup.get('PUH')?.value;

            if (!designation || !puh) {
                return;
            }

            const product = this.selectedProduct.find(
                (p) => p.name === (designation?.name || designation),
            );

            if (product) {
                this.updatePriceFieldsForProduct(
                    lineGroup as FormGroup,
                    product,
                    client,
                    this.settings,
                );
            }
        });

        this.recalculateTotals(lignes);
    }

    ajouterLigneSiNecessaire(index: number) {
        const lignes = this.all_lignes;
        const derniereLigne = lignes.at(index) as any;

        if (derniereLigne.triggered) return;

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

    supprimerLigne(index: number) {
        if (this.all_lignes.length > 1) {
            this.all_lignes.removeAt(index);
            this.recalculateTotals(this.all_lignes);
        }
    }

    autofindname(event: any) {
        const designation = event.query;
        const fuse = new Fuse(this.products, {
            keys: ['name'],
            threshold: 0.3,
            ignoreLocation: true,
            includeScore: true,
        });

        const resultats = fuse.search(designation);
        this.selectedProduct = resultats.map((r) => r.item);
    }

    autoaddprices(index: number) {
        const ligne = this.all_lignes.at(index);
        const product = ligne.get('DESIGNATION')?.value;
        const client = this.form.get('client')?.value;

        if (product && product.price) {
            this.updatePriceFieldsForProduct(
                ligne as FormGroup,
                product,
                client,
                this.settings,
            );
            this.recalculateTotals(this.all_lignes);
        }
    }

    handleClientChange(event: any) {
        const client = event.value;
        this.reapplyPricingToAllLines(client);
        this.updatevisibleCountTva();
    }

    toggleInputs() {
        this.showInputs = !this.showInputs;
    }

    clearForm() {
        this.form.reset();
        const lignes = this.form.get('lignes') as FormArray;
        lignes.clear();
        lignes.push(this.createInvoiceLineFormGroup(lignes));
        this.copied = false;

        this.cleared.emit();
    }

    submit() {
        if (this.form.valid) {
            const client = this.form.get('client')?.value;

            if (!client || client?.concern_ecomp) {
                this.form.get('ECOMP')?.reset();
            }

            if (!client || client?.assujetti_tva) {
                this.form.get('TVA')?.reset();
            }

            this.submitted.emit(this.form.value);
        } else {
            this.erreurInput = true;
            this.error.emit('Formulaire invalide !');

            Object.keys(this.form.controls).forEach((key) => {
                const control = this.form.get(key);
                if (control && control.invalid) {
                    console.warn(`Champ "${key}" invalide :`, control.errors);
                }
            });
        }
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
                this.error.emit(currentDesignation.name + ' existe déjà !');
                return { duplicateDesignation: true };
            }

            return null;
        };
    }

    updatevisibleCountStatus() {
        this.visibleCountStatus = 1;
        const status = this.form.get('status')?.value;

        if (!status || status.code === 1) this.visibleCountStatus += 1;
        if (!status || status.code !== 0) this.visibleCountStatus += 1;

        this.visibleCountStatus += 1;
    }

    updatevisibleCountTva() {
        this.visibleCountTva = 1;
        const client = this.form.get('client')?.value;

        if (!client || client.assujetti_tva) this.visibleCountTva += 1;
        if (!client || client.concern_ecomp) this.visibleCountTva += 1;

        this.visibleCountTva += 1;
    }
}
