import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { SupplierService } from '../../service/supplier.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InputTextModule } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import {
    AbstractControl,
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { Router } from '@angular/router';

@Component({
    selector: 'app-supplierslist',
    standalone: true,
    imports: [
        TableModule,
        CommonModule,
        ButtonModule,
        ConfirmDialog,
        Dialog,
        InputIconModule,
        IconFieldModule,
        FluidModule,
        InputTextModule,
        InputNumberModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './supplierslist.component.html',
    styleUrl: './supplierslist.component.scss',
})
export class SupplierslistComponent implements OnInit {
    @ViewChild('dt') dt!: Table;
    @ViewChild('op') op!: Popover;

    suppliers: any[] = [];
    visible: boolean = false;
    supplierName: string | undefined;
    selectedSupplierProducts!: any[];
    supplierDetailsDialog: boolean = false;
    supplierForm!: FormGroup;
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

    supplier: any = {};

    constructor(
        private supplierService: SupplierService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.supplierService.getAllSuppliers().subscribe({
            next: (response: any) => {
                this.suppliers = response;
            },
            error: (error: HttpErrorResponse) => {
                console.error(error.error.error);
                this.showError(error.error.error);
            },
        });
        this.supplierForm = this.fb.group({
            name: ['', Validators.required],
            nc: [''],
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

    mapStatus(status: string): number {
        const found = this.status.find((s) => s.name === status);
        return found ? parseInt(found.code, 10) : 0;
    }

    mapPaymentMethod(method: string): number {
        const index = this.preferredPaymentMethod.findIndex(
            (m) => m.name === method,
        );
        return index !== -1 ? index : 0;
    }

    mapCountry(country: string): number {
        const index = this.countries.findIndex((s) => s.name === country);
        return index !== -1 ? index : 0;
    }

    trash(event: Event, supplier: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous supprimer ce fournisseur ?',
            header: 'Supprimer',
            icon: 'fa-solid fa-circle-info',
            rejectLabel: 'annuler',
            rejectButtonProps: {
                label: 'Annuler',
                severity: 'secondary',
                outlined: true,
            },
            acceptButtonProps: {
                label: 'Confirmer',
                severity: 'danger',
            },

            accept: () => {
                this.supplierService.deleteSupplier(supplier.id).subscribe({
                    next: () => {
                        this.suppliers = this.suppliers.filter(
                            (s) => s.id !== supplier.id,
                        );
                        this.showSuccess('Suppression réussie');
                    },
                    error: () => {
                        this.showError('Échec de la suppression');
                    },
                });
            },
            reject: () => {
                this.showError('supprission annulé');
            },
        });
    }

    toggle(event: Event) {
        this.op.toggle(event);
    }

    showDialog(supplierName: string) {
        this.supplierService
            .get_products_supplied_by_supplier(supplierName)
            .subscribe({
                next: (response) => {
                    this.selectedSupplierProducts = response;
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                },
            });
        this.visible = true;
    }

    onSubmit() {
        this.loading = true;
        if (this.supplierForm.valid) {
            // Filtrer les produits vides
            const filteredProducts =
                this.supplierForm.value.productsSupplied.filter(
                    (product: any) =>
                        product.productName.trim() !== '' &&
                        product.price !== '',
                );

            const updatedSupplier = {
                ...this.supplier,
                ...this.supplierForm.value,
                productsSupplied: filteredProducts,
            };

            this.supplierService
                .updateSupplier(updatedSupplier, this.supplier.id)
                .subscribe({
                    next: (response: any) => {
                        this.showSuccess(
                            'Fournisseur mis à jour avec succès !',
                        );
                        this.loading = false;
                        const index = this.suppliers.findIndex(
                            (p) => p.id === this.supplier.id,
                        );
                        if (index !== -1) {
                            this.suppliers[index] = response;
                            this.suppliers = [...this.suppliers];
                        }
                    },
                    error: (error: any) => {
                        this.showError(error.error.error);
                        this.loading = false;
                    },
                });
        } else {
            this.erreurInput = true;
            this.loading = false;
            this.showError('Veuillez remplir tous les champs obligatoires.');
        }
    }

    goToDetails(supplier: any) {
        this.supplier = supplier;

        this.supplierForm = this.fb.group({
            name: [this.supplier.name, Validators.required],
            nc: [this.supplier.nc],
            status: [
                this.status[
                    this.mapStatus(this.supplier.status)
                ],
                Validators.required,
            ],
            address: [this.supplier.address],
            city: [this.supplier.city],
            postalCode: [this.supplier.postalCode],
            country: [this.countries[this.mapCountry(this.supplier.country)] || null],
            phone: [this.supplier.phone, Validators.required],
            email: [this.supplier.email, [Validators.email]],
            website: [this.supplier.website],
            preferredPaymentMethod: [
                this.preferredPaymentMethod[
                    this.mapPaymentMethod(
                        this.supplier.preferredPaymentMethod
                    )
                ] || null,
                Validators.required,
            ],
            productsSupplied: this.fb.array([]),
        });


        this.supplierService
            .get_products_supplied_by_supplier(supplier.name)
            .subscribe({
                next: (response) => {
                    response.forEach((product: any) => {
                        this.addProduct(product);
                    });
                    this.addProduct();
                },
            });
        this.supplierDetailsDialog = true;
    }

    addProduct(
        product: any = {
            productName: '',
            supplierPrice: null,
            SupplierName: null,
        },
    ): void {
        var productsArray = this.supplierForm.get(
            'productsSupplied',
        ) as FormArray;
        productsArray.push(
            this.fb.group({
                productName: [product.productName],
                price: [product.supplierPrice, [Validators.min(0)]],
            }),
        );
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

    removeProduct(index: number) {
        if (this.productsSupplied.length > 1) {
            this.productsSupplied.removeAt(index);
        }
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

    clearSelectedProducts() {
        this.selectedSupplierProducts = [];
    }

    applyFilter(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
            this.dt.filterGlobal(inputElement.value, 'contains');
        }
    }

    gotToAddSupplier() {
        this.router.navigate(['suppliers/addsupplier']);
    }

    exportCSV() {
        this.dt.exportCSV();
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

    clearSelectedSuppliers() {
        this.selectedSupplierProducts = [];
    }

    clearForm() {
        this.supplierForm.reset();
    }
}
