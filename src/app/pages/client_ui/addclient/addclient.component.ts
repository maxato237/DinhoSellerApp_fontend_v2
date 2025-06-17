import { Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormBuilder,
    FormGroup,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { ClientService } from '../../service/client.service';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../service/employee.service';
import { CheckboxModule } from 'primeng/checkbox';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-addclient',
    imports: [
        CommonModule,
        InputTextModule,
        ButtonModule,
        ReactiveFormsModule,
        FormsModule,
        TextareaModule,
        FluidModule,
        InputTextModule,
        SelectModule,
        InputNumberModule,
        DialogModule,
        Select,
        CheckboxModule,
    ],
    templateUrl: './addclient.component.html',
    styleUrl: './addclient.component.scss',
})
export class AddclientComponent implements OnInit {
    clientForm!: FormGroup;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    payment_methods: any[] = [
        { name: 'Orange Money', code: 'OM' },
        { name: 'MTN Money', code: 'MTN' },
        { name: 'Virement', code: 'VIR' },
        { name: 'Espèce', code: 'ESP' },
        { name: 'Chèque', code: 'CHQ' },
    ];
    payment_requirements: any[] = [
        { name: 'À la commande', code: 'CMD' },
        { name: 'À la livraison', code: 'LIV' },
        { name: 'Net 7 jours', code: 'N7' },
        { name: 'Net 15 jours', code: 'N15' },
        { name: 'Net 30 jours', code: 'N30' },
        { name: 'Paiement échelonné', code: 'ECH' },
    ];
    employees = [];

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private clientService: ClientService,
        private employeeService: EmployeeService,
    ) {
        this.clientForm = this.fb.group({
            name: ['', Validators.required],
            representant: ['', Validators.required],
            principal_address: [''],
            email: [''],
            phone: ['', Validators.required],
            specific_price: [''],
            payment_requirement: [''],
            payment_method: ['', Validators.required],
            facturation_address: [''],
            nc: [''],
            notes: [''],
            tva: [true],
            precompte: [false],
        });
    }

    ngOnInit(): void {
        this.employeeService.getAllUsers().subscribe({
            next: (data) => {
                this.employees = data;
            },
            error: (error: HttpErrorResponse) => {
                this.showError('Erreur lors de la récupération des employés');
            },
        });
    }

    onSubmit() {
        if (this.clientForm.invalid) {
            this.erreurInput = true;
            this.showError('Veuillez remplir tous les champs obligatoires.');
        } else {
            this.erreurInput = false;
            this.loading = true;
            this.clientService.addCient(this.clientForm.value).subscribe({
                next: () => {
                    this.showSuccess('Client ajouté avec succès');
                },
                error: (error:HttpErrorResponse) => {
                    this.showError("Erreur lors de l'ajout du client");
                    console.error(error.error.error);
                    this.loading = false;
                },
                complete: () => {
                    this.loading = false;
                },
            });
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
        this.clientForm.reset();
    }

    goToClientList() {
        this.router.navigate(['clients/clientslist']);
    }
}
