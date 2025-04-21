import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
    FormGroup,
    FormBuilder,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Popover } from 'primeng/popover';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog, DialogModule } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Select, SelectModule } from 'primeng/select';
import { ClientService } from '../../service/client.service';
import { EmployeeService } from '../../service/employee.service';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-clientslist',
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
        DialogModule,
        Select,
        CheckboxModule,
        TextareaModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './clientslist.component.html',
    styleUrl: './clientslist.component.scss',
})
export class ClientslistComponent {

    @ViewChild('dt') dt!: Table;
    @ViewChild('op') op!: Popover;

    clients: any[] = [];
    employees: any[] = [];
    selectedClientsProducts: any[] = [];
    visible: boolean = false;
    clientName: string | undefined;
    clientDetailsDialog: boolean = false;
    clientForm!: FormGroup;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    status: any[] = [
        { name: 'Active', code: '0' },
        { name: 'Inactive', code: '1' },
    ];
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
    client: any = {};

    constructor(
        private clientService: ClientService,
        private employeeService: EmployeeService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.clientService.getAllClients().subscribe({
            next: (data) => {
                this.clients = data;
            },
            error: (error:HttpErrorResponse) => {
                this.showError(error.error.error);
                console.error(error.error.error);
            },
        });
        this.employeeService.getAllUsers().subscribe({
            next: (data) => {
                this.employees = data;
                console.log(this.employees);
            },
            error: (error:HttpErrorResponse) => {
                console.error(error.error.error);
            },
        });
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
            notes: [''],
            tva: [false],
            ecomp: [false],
        });
    }

    goToDetails(client: any) {
        this.client = client;
        this.clientDetailsDialog = true;
        this.clientForm = this.fb.group({
            name: [client.name, Validators.required],
            representant: [this.mapEmployee(client.representant)|| null, Validators.required],
            principal_address: [client.principal_address],
            email: [client.email],
            phone: [client.phone, Validators.required],
            specific_price: [client.specific_price*100],
            payment_requirement: [this.payment_requirements[this.mapPayment_requirement(client.payment_requirement)]|| null],
            payment_method: [this.payment_methods[this.mapPaymentMethod(client.payment_method)]|| null],
            facturation_address: [client.facturation_address],
            notes: [client.notes],
            tva: [client.assujetti_tva],
            ecomp: [client.concern_ecomp],
        });
    }

    goToEmplyeeDetails(employeeId: any) {
        this.showSuccess('Détails de l\'employé  '+ employeeId);
        // this.router.navigate(['employees/details', employeeId]);
    }

    mapEmployee(employeeId: number): any {
        return this.employees.find(emp => emp.id === employeeId) || null;
    }


    mapPayment_requirement(payment_requirement: string): number {
        const index = this.payment_requirements.findIndex((s) => s.name === payment_requirement);
        return index !== -1 ? index : 0;
    }

    mapPaymentMethod(method: string): number {
        const index = this.payment_methods.findIndex((m) => m.name === method);
        return index !== -1 ? index : 0;
    }

    getEmployeeName(employeeId: number): string {
        const employee = this.employees.find(emp => emp.id === employeeId);
        return employee ? `${employee.firstname} ${employee.lastname}` : 'N/A';
    }

    gotToAddClient() {
        this.router.navigate(['clients/addclient']);
    }

    trash(event: Event, client: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous supprimer ce client ?',
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
                this.clientService.deleteCient(client.id).subscribe({
                    next: () => {
                        this.clients = this.clients.filter(
                            (s) => s.id !== client.id,
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

    onSubmit() {
        this.loading = true;
        console.log(this.clientForm.value);

        if (this.clientForm.valid) {
            const updatedClient = {
                ...this.client,
                ...this.clientForm.value,
            };

            this.clientService
                .updateCient(updatedClient, this.client.id)
                .subscribe({
                    next: (response: any) => {
                        this.showSuccess('Client mis à jour avec succès !');
                        this.loading = false;
                        const index = this.clients.findIndex(
                            (p) => p.id === this.client.id,
                        );
                        if (index !== -1) {
                            this.clients[index] = response;
                            this.clients = [...this.clients];
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
            console.log('Erreur dans le formulaire');
            this.showError('Veuillez remplir tous les champs obligatoires.');
        }
    }

    applyFilter(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
            this.dt.filterGlobal(inputElement.value, 'contains');
        }
    }

    gotToAddEmployees() {
        this.router.navigate(['employees/addclient']);
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

    clearForm() {
        this.clientForm.reset();
    }

    clearSelectedClient() {
        this.selectedClientsProducts = [];
    }


}
