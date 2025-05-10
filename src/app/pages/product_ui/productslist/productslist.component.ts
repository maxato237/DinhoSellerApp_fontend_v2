import { Component, OnInit, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { MeterGroup } from 'primeng/metergroup';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductService } from '../../service/products.service';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-productslist',
    imports: [
        MeterGroup,
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
        MultiSelectModule
    ],
    providers: [ConfirmationService],
    templateUrl: './productslist.component.html',
    styleUrl: './productslist.component.scss',
})
export class ProductslistComponent implements OnInit {
    products: any[] = [];
    value: { label: string; color: string; value: number }[] = [];
    articlesDialog: boolean = false;
    articlesDetailsDialog: boolean = false;
    selectedSupplierProducts!: any[];
    @ViewChild('dt') dt!: Table;
    selectedProduct: any;
    categories: any[] = [
        { name: 'Boissons', code: '0' },
        { name: 'Épicerie', code: '1' },
        { name: 'Produits Surgelés', code: '2' },
        { name: 'Boulangerie & Pâtisserie', code: '3' },
        { name: 'Produits d’Hygiène', code: '4' },
        { name: 'Entretien & Nettoyage', code: '5' },
    ];
    suppliers: any[] = [];
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    productForm!: FormGroup;
    product: any = {};

    constructor(
        private productService: ProductService,
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
    ) {
        this.productForm = this.fb.group({
            code: ['', Validators.required],
            reference: ['', Validators.required],
            name: ['', Validators.required],
            category: [null, Validators.required],
            quantity: [null, [Validators.required, Validators.min(1)]],
            minimum_stock: [null, [Validators.required, Validators.min(1)]],
            weight: [null, [Validators.min(0)]],
            brand: [''],
            suppliers: [null, Validators.required],
        });
    }

    ngOnInit() {
        this.productService.getAllProducts().subscribe({
            next: (response) => {
                this.products = response;
                this.updateStockProportions();
            },
            error: (error: HttpErrorResponse) => {
                this.showError(error.error.error);
            }
        });
    }

    getTotalPurchasePrice(): number {
        return this.products.reduce(
            (total, product) => total + product.price * product.quantity,
            0,
        );
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    showDialog(productName: string) {
        this.productService
            .get_products_supplied_by_product(productName)
            .subscribe({
                next: (response) => {
                    this.selectedSupplierProducts = response;
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                },
            });
        this.articlesDialog = true;
    }

    updateStockProportions(): void {
        const totalProducts = this.products.length;

        const stockEpuisé =
            (this.products.filter((p) => p.quantity < 10).length /
                totalProducts) *
            100;
        const stockBas =
            (this.products.filter((p) => p.quantity >= 10 && p.quantity < 30)
                .length /
                totalProducts) *
            100;
        const enStock =
            (this.products.filter((p) => p.quantity >= 30).length /
                totalProducts) *
            100;

        this.value = [
            { label: 'En Stock', color: '#34d399', value: enStock },
            { label: 'Stock bas', color: '#fbbf24', value: stockBas },
            { label: 'Stock épuisé', color: '#9A031E', value: stockEpuisé },
        ];
    }

    trash(event: Event, product: any) {
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
                this.productService.deleteProduct(product.id).subscribe({
                    next: () => {
                        this.products = this.products.filter(
                            (s) => s.id !== product.id,
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

    goToDetails(product: any) {
        this.product = product;

        this.productService
            .get_products_supplied_by_product(product.name)
            .subscribe({
                next: (response) => {
                    this.suppliers = response;

                    console.log(response);

                    this.productForm = this.fb.group({
                        code: [product.code, Validators.required],
                        reference: [product.reference, Validators.required],
                        name: [product.name, Validators.required],
                        category: [
                            this.categories[
                                this.mapCategries(response.category)
                            ],
                            Validators.required,
                        ],
                        quantity: [
                            product.quantity,
                            [Validators.required, Validators.min(1)],
                        ],
                        minimum_stock: [
                            product.minimumStock,
                            [Validators.required, Validators.min(1)],
                        ],
                        weight: [product.weight, [Validators.min(0)]],
                        brand: [product.brand],
                        suppliers: [
                            response,
                            Validators.required,
                        ],
                    });
                    this.articlesDetailsDialog = true;
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                },
            });
    }

    mapCategries(categary: string): number {
        const found = this.categories.find((s) => s.name === categary);
        return found ? parseInt(found.code, 10) : 0;
    }

    applyFilter(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
            this.dt.filterGlobal(inputElement.value, 'contains');
        }
    }

    goToAddProduct() {
        this.router.navigate(['products/addproduct']);
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

    onSubmit() {
        this.loading = true;
        if (this.productForm.valid) {
            const updatedProduct = {
                ...this.product,
                ...this.productForm.value,
            };

            this.productService
                .updateProduct(updatedProduct, this.product.id)
                .subscribe({
                    next: (response: any) => {
                        this.showSuccess('Produit mis à jour avec succès !');
                        this.loading = false;
                        const index = this.products.findIndex(
                            (p) => p.id === this.product.id,
                        );
                        if (index !== -1) {
                            this.products[index] = response;
                            this.products = [...this.products];
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

    clearForm() {
        this.productForm.reset();
    }
}
