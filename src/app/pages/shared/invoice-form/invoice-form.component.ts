import {
    trigger,
    state,
    style,
    transition,
    animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
    Component,
    Input,
    Output,
    EventEmitter,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
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
export class InvoiceFormComponent implements OnChanges {
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
    @Input() isOneInvoice!: boolean;

    @Output() submitted = new EventEmitter<void>();
    @Output() cleared = new EventEmitter<void>();
    @Output() error = new EventEmitter<string>();

    // Champs calculés

    visibleCountStatus = 4;
    visibleCountTva = 4;

    constructor(private fb: FormBuilder) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['form'] && !this.invoiceDevidedlignes) {
            const lignes = this.form.get('lignes') as FormArray;
            lignes.push(this.createInvoiceLineFormGroup(lignes));
        }
        if (changes['client']) {
            const clientControl = this.form.get('client');
            clientControl?.patchValue({ ...this.client });
            this.handleClientChange({ value: this.client });
        }
        if (changes['divisedstatus']) {
            this.form.get('status')?.patchValue(this.divisedstatus);
            this.updatevisibleCountStatus();
        }
        if (
            changes['invoiceDevidedlignes'] &&
            this.invoiceDevidedlignes?.length > 0
        ) {
            const lignes = this.form.get('lignes') as FormArray;
            lignes.clear();

            for (let i = 0; i < this.invoiceDevidedlignes.length; i++) {
                const sourceLigne = this.invoiceDevidedlignes.at(i);
                const newLigne = this.createInvoiceLineFormGroup(lignes);

                const ligneValue = sourceLigne.value;
                newLigne.patchValue({
                    DESIGNATION: ligneValue.DESIGNATION,
                    QUANTITY: ligneValue.QUANTITY,
                    PUH: ligneValue.PUH,
                    PUTTC: ligneValue.PUTTC,
                    PTH: ligneValue.PTH,
                    PTTTC: ligneValue.PTTTC,
                    PVC: ligneValue.PVC,
                });

                lignes.push(newLigne);
            }

            lignes.push(this.createInvoiceLineFormGroup(lignes));

            this.setupValueChangesForLignes();
        }
    }

    setupValueChangesForLignes() {
        const lignes = this.form.get('lignes') as FormArray;

        lignes.controls.forEach((lineGroup: AbstractControl) => {
            const qte = lineGroup.get('QUANTITY');
            const puh = lineGroup.get('PUH');


            if (qte && puh) {
                qte.valueChanges.subscribe(() => this.recalculateTotals(lignes, this.client));
                puh.valueChanges.subscribe(() => this.recalculateTotals(lignes, this.client));
            }
        });

        this.recalculateTotals(lignes, this.client);
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
        let PUH = product.price;
        let PVC = 0;

        if (client && client.concern_ecomp) {
            const ecomp = settings.ECOMP || 0;
            PUH = Math.round(PUH - PUH * ecomp);
        }
        if (client && client.specific_price > 0) {
            PUH = Math.round(PUH - PUH * client.specific_price);
        }

        const tva = settings.TVA || 0;
        const pvcRate = settings.PVC || 0;
        if (!client || client?.assujetti_tva) {
            let PUTTC = 0;
            PUTTC = Math.round(PUH + PUH * tva);
            group.get('PUTTC')?.patchValue(PUTTC, { emitEvent: false });
        }

        PVC = Math.round(
            product.price +
                product.price * tva +
                (product.price + product.price * tva) * pvcRate,
        );

        group.get('PUH')?.patchValue(PUH, { emitEvent: false });
        group.get('PVC')?.patchValue(PVC, { emitEvent: false });
    }

    createInvoiceLineFormGroup(lignes: FormArray): FormGroup {
        const group = this.fb.group({
            DESIGNATION: [null],
            QUANTITY: [null],
            PUH: [null as number | null],
            PUTTC: [null as number | null],
            PTH: [null as number | null],
            PTTTC: [null as number | null],
            PVC: [null as number | null],
        });

        group
            .get('DESIGNATION')
            ?.setValidators([this.uniqueDesignationValidator(lignes)]);

        group.get('DESIGNATION')?.valueChanges.subscribe((value: any) => {
            const matchingProduct = this.selectedProduct.find(
                (p) => p.name === value,
            );
            const client = this.form.get('client')?.value;
            console.log('le client 1 :', client);

            if (!matchingProduct) {
                group.get('PUH')?.reset();
                group.get('PUTTC')?.reset();
                group.get('PTH')?.reset();
                group.get('PTTTC')?.reset();
                group.get('PVC')?.reset();
            } else {
                this.updatePriceFieldsForProduct(
                    group,
                    matchingProduct,
                    client,
                    this.settings,
                );
            }
            this.recalculateTotals(lignes, client);
        });

        group.get('QUANTITY')?.valueChanges.subscribe(() => {
            const client = this.form.get('client')?.value;
            console.log('le client 2 :', client);
            this.recalculateTotals(lignes, client);
        });

        (group as any).triggered = false;
        return group;
    }

    recalculateTotals(lignes: FormArray, client?: any) {

        let totalHT = 0;
        let totalPrecompte = 0;
        let totalTVA = 0;
        let totalTTC = 0;

        lignes.controls.forEach((lineGroup) => {
            const quantity = +lineGroup.get('QUANTITY')?.value || 0;
            const puh = +lineGroup.get('PUH')?.value || 0;

            let pth = 0;
            let ptttc = 0;

            if (quantity > 0 && puh > 0) {
                pth = quantity * puh;
                lineGroup.get('PTH')?.patchValue(pth, { emitEvent: false });

                if (!client || client?.assujetti_tva) {
                    const puttc = +lineGroup.get('PUTTC')?.value || 0;
                    ptttc = quantity * puttc;
                    lineGroup
                        .get('PTTTC')
                        ?.patchValue(ptttc, { emitEvent: false });
                    totalTTC += ptttc;
                }
                totalHT += pth;
            } else {
                lineGroup.get('PTH')?.reset();
                lineGroup.get('PTTTC')?.reset();
            }
        });

        if (!client || client?.concern_precompte) {
            const precompteRate = this.settings.PRECOMPTE || 0;
            totalPrecompte = totalHT * precompteRate;
        }
        if (!client || client?.assujetti_tva) {
            const tvaRate = this.settings.TVA || 0;
            totalTVA = totalHT * tvaRate;
        }

        this.form
            .get('PRECOMPTE')
            ?.patchValue(Math.round(totalPrecompte), { emitEvent: false });
        this.form
            .get('TVA')
            ?.patchValue(Math.round(totalTVA), { emitEvent: false });
        this.form
            .get('TTC')
            ?.patchValue(Math.round(totalTTC), { emitEvent: false });
        this.form
            .get('HT')
            ?.patchValue(Math.round(totalHT), { emitEvent: false });
    }

    reapplyPricingToAllLines(client: any) {
        const lignes = this.all_lignes;

        lignes.controls.forEach((lineGroup) => {
            const designation = lineGroup.get('DESIGNATION')?.value;
            const puttc = lineGroup.get('PUTTC')?.value;

            if (!designation || !puttc) {
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

        const hasValue = [
            'DESIGNATION',
            'QUANTITY',
            'PUTTC',
            'PTH',
            'PVC',
        ].some((field) => derniereLigne.get(field)?.value !== '');

        if (hasValue) {
            derniereLigne.triggered = true;

            const dernierIndex = lignes.length - 1;
            const derniereValeur = lignes.at(dernierIndex);
            const lastHasValue = [
                'DESIGNATION',
                'QUANTITY',
                'PUTTC',
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
            this.recalculateTotals(
                this.all_lignes,
                this.form.get('client')?.value,
            );
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
        console.log('client sélectionné :', client);
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
                control.patchValue('');
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
        let count = 1;

        const client = this.form.get('client')?.value;

        if (!client || client.assujetti_tva) count += 2; // TVA et TTC
        if (!client || client.concern_precompte) count += 1; // Précompte

        this.visibleCountTva = count;
    }
}
