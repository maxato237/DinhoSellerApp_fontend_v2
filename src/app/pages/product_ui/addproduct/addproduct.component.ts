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
import { MultiSelectModule } from 'primeng/multiselect';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

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
        MultiSelectModule,
    ],
    templateUrl: './addproduct.component.html',
    styleUrl: './addproduct.component.scss',
})
export class AddproductComponent implements OnInit {
    productForm!: FormGroup;
    categories: any[] = [
        { name: 'ARTICLES CUISINE', code: '0' },
        { name: 'BIERES CIDRES', code: '1' },
        { name: 'BISCOTTES ET ASSIMILES', code: '2' },
        { name: 'BISCUITS ', code: '3' },
        { name: 'BISCUITS APERITIFS', code: '4' },
        { name: 'BROSSES, EPONGES', code: '5' },
        { name: 'CHIPS', code: '5' },
        { name: 'CHOCOLATS EN TABLETTE', code: '5' },
        { name: 'CONDIMENTS ET SAUCES', code: '5' },
        { name: 'CONFISERIE', code: '5' },
        { name: 'CONFITURES COMPOTES', code: '5' },
        { name: 'COUCHE BEBE', code: '5' },
        { name: 'CONSERVES DE LEGUMES', code: '5' },
        { name: 'DESODORISANTS', code: '5' },
        { name: 'DROGUERIE', code: '5' },
        { name: 'EAUX MINERALES ', code: '5' },
        { name: 'ENTREMETS', code: '5' },
        { name: 'EPICES', code: '5' },
        { name: 'FARINE', code: '5' },
        { name: 'FILTRES', code: '5' },
        { name: 'FRUITS ET LEGUMES SECS', code: '5' },
        { name: 'HUILES', code: '5' },
        { name: 'HYGIENE', code: '5' },
        { name: 'HYGIENE FEMININE', code: '5' },
        { name: 'LAITS CONSERVES', code: '5' },
        { name: 'LESSIVES', code: '5' },
        { name: 'LIMONADE JUS DE FRUITS SIROPS', code: '5' },
        { name: 'MOUCHOIRS', code: '5' },
        { name: 'PAPIER ESSUIE TOUT', code: '5' },
        { name: 'PAPIER TOILETTES', code: '5' },
        { name: 'PATE A TARTINER', code: '5' },
        { name: 'PATES ALIMENTAIRES', code: '5' },
        { name: 'PLATS CUISINES ET A PREPARER', code: '5' },
        { name: 'PRODUITS DIETETIQUES', code: '5' },
        { name: 'PRODUITS ENTRETIEN', code: '5' },
        { name: 'PRODUITS NETTOYANTS', code: '5' },
        { name: 'PRODUITS POUR ANIMAUX', code: '5' },
        { name: 'PRODUITS, ACCESSOIRES  VAISSELLE', code: '5' },
        { name: 'PUREE  SEMOULE', code: '5' },
        { name: 'SACS POUBELLE', code: '5' },
        { name: 'SELS', code: '5' },
        { name: 'SOINS CHEVELURE', code: '5' },
        { name: 'SUCRE', code: '5' },
        { name: 'THE, INFUSION', code: '5' },
        { name: 'VINAIGRES', code: '5' },
    ];
    suppliers: any[] | undefined;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    filteredSuppliers: any[] = [];
    designationInputSubject: Subject<string> = new Subject<string>();

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private productService: ProductService,
        private messageService: MessageService,
        private supplierService: SupplierService,
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
            suppliers: [null, Validators.required],
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

    filterSuppliers(productName: string) {
        console.log(productName);

        this.productService
            .get_products_supplied_by_product(productName)
            .subscribe({
                next: (response) => {
                    this.filteredSuppliers = response;
                    this.productForm.patchValue({
                        suppliers: this.filteredSuppliers,
                    });
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                },
            });
    }

    designationInputChanged(event: any) {
        const inputValue = event.target.value.toLowerCase();
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
