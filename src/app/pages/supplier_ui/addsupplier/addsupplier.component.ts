import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormBuilder,
    Validators,
    FormArray,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SupplierService } from '../../service/supplier.service';
import { FluidModule } from 'primeng/fluid';

@Component({
    selector: 'app-addsupplier',
    imports: [
        CommonModule,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        Select,
        FluidModule,
    ],
    templateUrl: './addsupplier.component.html',
    styleUrl: './addsupplier.component.scss',
})
export class AddsupplierComponent {
    supplierForm: FormGroup;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    status: any[] = [
        { name: 'Active', code: '0' },
        { name: 'Inactive', code: '1' },
    ];
    preferredPaymentMethod: any[] = [
        { name: 'Orange Money', code: 'OM' },
        { name: 'MTN Money', code: 'MTN' },
        { name: 'Virement', code: 'VIR' },
        { name: 'Espèce', code: 'ESP' },
        { name: 'Chèque', code: 'CHQ' },
    ];
    countries: any[] = [
        { name: 'Afrique du Sud', code: 'ZA' },
        { name: 'Algérie', code: 'DZ' },
        { name: 'Angola', code: 'AO' },
        { name: 'Bénin', code: 'BJ' },
        { name: 'Botswana', code: 'BW' },
        { name: 'Burkina Faso', code: 'BF' },
        { name: 'Burundi', code: 'BI' },
        { name: 'Cap-Vert', code: 'CV' },
        { name: 'Cameroun', code: 'CM' },
        { name: 'République centrafricaine', code: 'CF' },
        { name: 'Comores', code: 'KM' },
        { name: 'République du Congo', code: 'CG' },
        { name: 'République démocratique du Congo', code: 'CD' },
        { name: 'Djibouti', code: 'DJ' },
        { name: 'Égypte', code: 'EG' },
        { name: 'Guinée équatoriale', code: 'GQ' },
        { name: 'Érythrée', code: 'ER' },
        { name: 'Eswatini', code: 'SZ' },
        { name: 'Éthiopie', code: 'ET' },
        { name: 'Gabon', code: 'GA' },
        { name: 'Gambie', code: 'GM' },
        { name: 'Ghana', code: 'GH' },
        { name: 'Guinée', code: 'GN' },
        { name: 'Guinée-Bissau', code: 'GW' },
        { name: "Côte d'Ivoire", code: 'CI' },
        { name: 'Kenya', code: 'KE' },
        { name: 'Lesotho', code: 'LS' },
        { name: 'Liberia', code: 'LR' },
        { name: 'Libye', code: 'LY' },
        { name: 'Madagascar', code: 'MG' },
        { name: 'Malawi', code: 'MW' },
        { name: 'Mali', code: 'ML' },
        { name: 'Mauritanie', code: 'MR' },
        { name: 'Maurice', code: 'MU' },
        { name: 'Maroc', code: 'MA' },
        { name: 'Mozambique', code: 'MZ' },
        { name: 'Namibie', code: 'NA' },
        { name: 'Niger', code: 'NE' },
        { name: 'Nigeria', code: 'NG' },
        { name: 'Rwanda', code: 'RW' },
        { name: 'Sao Tomé-et-Principe', code: 'ST' },
        { name: 'Sénégal', code: 'SN' },
        { name: 'Seychelles', code: 'SC' },
        { name: 'Sierra Leone', code: 'SL' },
        { name: 'Somalie', code: 'SO' },
        { name: 'Soudan', code: 'SD' },
        { name: 'Soudan du Sud', code: 'SS' },
        { name: 'Tanzanie', code: 'TZ' },
        { name: 'Togo', code: 'TG' },
        { name: 'Tunisie', code: 'TN' },
        { name: 'Ouganda', code: 'UG' },
        { name: 'Zambie', code: 'ZM' },
        { name: 'Zimbabwe', code: 'ZW' },
    ];


    constructor(
        private fb: FormBuilder,
        private messageService: MessageService,
        private supplierService: SupplierService,
        private router: Router,
    ) {
        this.supplierForm = this.fb.group({
            name: ['', Validators.required],
            status: [null, Validators.required],
            address: [''],
            city: [''],
            postalCode: [''],
            country: [''],
            phone: ['', Validators.required],
            email: ['', [Validators.email]],
            website: [''],
            preferredPaymentMethod: [null, Validators.required],
            productsSupplied: this.fb.array([this.createProductFormGroup()]),
        });
    }

    get productsSupplied(): FormArray {
        return this.supplierForm.get('productsSupplied') as FormArray;
    }

    createProductFormGroup(): FormGroup {
        return this.fb.group({
            productName: [''],
            price: ['', [Validators.min(0)]],
        });
    }

    addProductIfNeeded(index: number) {
        const currentProduct = this.productsSupplied.at(index);
        if (
            currentProduct.get('productName')?.value !== '' ||
            currentProduct.get('price')?.value !== ''
        ) {
            const lastIndex = this.productsSupplied.length - 1;
            if (
                this.productsSupplied.at(lastIndex).get('productName')
                    ?.value !== '' ||
                this.productsSupplied.at(lastIndex).get('price')?.value !== ''
            ) {
                this.productsSupplied.push(this.createProductFormGroup());
            }
        }
    }

    removeProduct(index: number) {
        if (this.productsSupplied.length > 1) {
            this.productsSupplied.removeAt(index);
        }
    }

    onSubmit() {
        if (this.supplierForm.valid) {
            const name = this.supplierForm.get('name')?.value;
            const status = this.supplierForm.get('status')?.value.name;
            const address = this.supplierForm.get('address')?.value;
            const city = this.supplierForm.get('city')?.value;
            const postalCode = this.supplierForm.get('postalCode')?.value;
            const country = this.supplierForm.get('country')?.value;
            const phone = this.supplierForm.get('phone')?.value;
            const email = this.supplierForm.get('email')?.value;
            const website = this.supplierForm.get('website')?.value;
            const preferredPaymentMethod = this.supplierForm.get(
                'preferredPaymentMethod',
            )?.value.name;
            const productsSupplied = this.productsSupplied.value;

            // Création de l'objet JSON
            const supplierData = {
                name: name,
                status: status,
                address: address,
                city: city,
                postalCode: postalCode,
                country: country,
                phone: phone,
                email: email,
                website: website,
                preferredPaymentMethod: preferredPaymentMethod,
                productsSupplied: productsSupplied,
            };

            this.loading = true;

            // Envoi de l'objet JSON
            this.supplierService.addSupplier(supplierData).subscribe({
                next: (response) => {
                    this.showSuccess('Fournisseur ajouté avec succès !');
                    this.supplierForm.reset();
                    this.productsSupplied.clear();
                    this.productsSupplied.push(this.createProductFormGroup());
                    this.loading = false;
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                    this.loading = false;
                },
            });
        } else {
            this.erreurInput = true;
            this.showError('Veuillez remplir tous les champs obligatoires.');
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

    clearForm() {
        this.supplierForm.reset();
        this.productsSupplied.clear();
        this.productsSupplied.push(this.createProductFormGroup());
    }

    goToSupplierList() {
        this.router.navigate(['suppliers/list-suppliers']);
    }
}
