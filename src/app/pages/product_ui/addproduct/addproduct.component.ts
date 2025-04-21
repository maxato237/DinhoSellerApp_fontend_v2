import { Component, OnInit } from '@angular/core';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../service/products.service';
import { MessageService } from 'primeng/api';
import { SupplierService } from '../../service/supplier.service';
import { CommonModule } from '@angular/common';
import { InputNumberModule } from 'primeng/inputnumber';
@Component({
    selector: 'app-addproduct',
    imports: [
        InputTextModule,
        InputNumberModule,
        FluidModule,
        ButtonModule,
        SelectModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
    ],
    templateUrl: './addproduct.component.html',
    styleUrl: './addproduct.component.scss',
})
export class AddproductComponent implements OnInit {
    productForm!: FormGroup;
    categories: any[] = [
        { name: 'Boissons', code: '0' },
        { name: 'Épicerie', code: '1' },
        { name: 'Produits Surgelés', code: '2' },
        { name: 'Boulangerie & Pâtisserie', code: '3' },
        { name: 'Produits d’Hygiène', code: '4' },
        { name: 'Entretien & Nettoyage', code: '5' },
    ];
    suppliers: any[] | undefined;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private productService: ProductService,
        private messageService: MessageService,
        private supplierService: SupplierService
    ) {}

    ngOnInit(): void {
        this.initForm();
        this.loadSuppliers();
    }

    initForm() {
        this.productForm = this.fb.group({
            code: ['', Validators.required],
            reference: ['', Validators.required],
            name: ['', Validators.required],
            category: [null, Validators.required],
            quantity: [null, [Validators.required, Validators.min(1)]],
            minimum_stock: [null, [Validators.required, Validators.min(1)]],
            weight: [null, [Validators.min(0)]],
            brand: [''],
            supplier: [null, Validators.required],
        });
    }

    loadSuppliers() {
        this.supplierService.getAllSuppliers().subscribe({
            next: (response) => {
                this.suppliers = response;
            },
            error: (err) => {
                console.error(
                    'Erreur lors du chargement des fournisseurs',
                    err,
                );
            },
        });
    }

    onSubmit() {
        this.loading = true;

        if (this.productForm.valid) {
            const newProduct = this.productForm.value;
            this.productService.addProduct(newProduct).subscribe({
                next: (response: any) => {
                    this.showSuccess('Produit ajouté avec succès !');
                    this.loading = false;
                },
                error: (error: any) => {
                    this.showError(error.error.error);
                    this.loading = false;
                },
            });
        } else {
            this.erreurInput = true;
            this.loading = false;
            console.log('erreur dans le formulaire');
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

    backToListPage() {
        this.router.navigate(['/products/productslist']);
    }

    clearForm() {
        this.productForm.reset();
    }
}
