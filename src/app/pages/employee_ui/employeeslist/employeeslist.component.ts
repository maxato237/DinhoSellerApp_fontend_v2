import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { Popover } from 'primeng/popover';
import { SelectModule } from 'primeng/select';
import { TableModule, Table } from 'primeng/table';
import { EmployeeService } from '../../service/employee.service';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';


@Component({
    selector: 'app-employeeslist',
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
        CheckboxModule,
        DatePickerModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './employeeslist.component.html',
    styleUrl: './employeeslist.component.scss',
})
export class EmployeeslistComponent implements OnInit  {
    @ViewChild('dt') dt!: Table;
    @ViewChild('op') op!: Popover;

    employees: any[] = [];
    visible: boolean = false;
    employeeName: string | undefined;
    employeeDetailsDialog: boolean = false;
    selectedEmployees!: any[];
    employeeForm!: FormGroup;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    genres: any[] = [
        { name: 'Masculin', code: 'M' },
        { name: 'Feminin', code: 'F' },
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

    roles: any[] = [
        { name: 'Administrateur', code: 2 },
        { name: 'Utilisateur', code: 3},
    ];

    contrats: any[] = [
        { name: 'Contrat à Durée Indéterminée', code: 'cdi' },
        { name: 'Contrat à Durée Déterminée', code: 'cdd' },
        { name: 'Contrat de Travail Temporaire', code: 'interim' },
        { name: 'Contrat de Projet ou de Mission', code: 'mission' },
        { name: 'Contrat à Temps Partiel', code: 'temps_partiel' },
        { name: 'Contrat de Travail Intermittent', code: 'intermittent' },
        { name: "Contrat d'Apprentissage", code: 'apprentissage' },
        {
            name: 'Contrat de Professionnalisation',
            code: 'professionnalisation',
        },
        { name: 'Contrat de Prestation de Services', code: 'freelance' },
        { name: 'Portage Salarial', code: 'portage_salarial' },
        { name: 'Convention de Stage', code: 'stage' },
    ];

    departements: any[] = [
        { name: 'Direction', code: 'direction' },
        { name: 'Ventes', code: 'ventes' },
        { name: 'Stock & Logistique', code: 'stock_logistique' },
        { name: 'Comptabilité & Finance', code: 'comptabilite' },
        { name: 'Service Client', code: 'service_client' },
        { name: 'Sécurité', code: 'securite' },
        { name: 'Livraison', code: 'livraison' },
    ];

    employee: any = {};

    constructor(
        private employeeService: EmployeeService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private fb: FormBuilder,
    ) {}

    ngOnInit() {
        this.employeeService.getAllUsers().subscribe({
            next: (response: any) => {
                this.employees = response;
            },
            error: (error: HttpErrorResponse) => {
                console.error(error.error.error);
                this.showError(error.error.error);
            },
        });
        this.employeeForm = this.fb.group({
            lastname: ['', Validators.required],
            firstname: ['', Validators.required],
            date_of_birth: [null],
            genre: [null],
            address: [''],
            address_mail: ['', [Validators.email]],
            country: [null],
            city: [''],
            personnal_mail_address: ['', [Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
            post: [''],
            start_date_of_hire: [null],
            contract_type: [null],
            salary: [null, Validators.min(0)],
            role_id: [null, Validators.required],
            department: [null],
        });
    }

    mapGenre(genre: string): number {
        const index = this.genres.findIndex((s) => s.name === genre);
        return index !== -1 ? index : 0;
    }

    mapCountry(country: string): number {
        const index = this.countries.findIndex((s) => s.name === country);
        return index !== -1 ? index : 0;
    }

    mapDepartment(department: string): number {
        const index = this.departements.findIndex((s) => s.name === department);
        return index !== -1 ? index : 0;
    }

    mapContractType(contractType: string): number {
        const index = this.contrats.findIndex((s) => s.name === contractType);
        return index !== -1 ? index : 0;
    }



    trash(event: Event, employee: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: 'Voulez-vous supprimer ce employé ?',
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
                this.employeeService.deleteUser(employee.id).subscribe({
                    next: () => {
                        this.employees = this.employees.filter(
                            (s) => s.id !== employee.id,
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

        if (this.employeeForm.valid) {

            const updatedEmployee = {
                ...this.employee,
                ...this.employeeForm.value,
            };

            this.employeeService
                .updateUsers(updatedEmployee, this.employee.id)
                .subscribe({
                    next: (response: any) => {
                        this.showSuccess(
                            'Employé mis à jour avec succès !',
                        );
                        this.loading = false;
                        const index = this.employees.findIndex(
                            (p) => p.id === this.employee.id,
                        );
                        if (index !== -1) {
                            this.employees[index] = response;
                            this.employees = [...this.employees];
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

    goToDetails(employee: any) {
        this.employee = employee;

        this.employeeForm = this.fb.group({
            lastname: [employee.lastname, Validators.required],
            firstname: [employee.firstname, Validators.required],
            date_of_birth: [employee.details?.date_of_birth ? new Date(employee.details.date_of_birth) : null],
            genre: [this.genres[this.mapGenre(employee.details?.genre)] || null],
            address: [employee.details?.address || ''],
            address_mail: [employee.details?.address_mail || '', [Validators.email]],
            country: [this.countries[this.mapCountry(employee.details?.country)] || null],
            city: [employee.details?.city || ''],
            personnal_mail_address: [employee.details?.personnal_mail_address || '', [Validators.email]],
            phone: [employee.phone || '', [Validators.required, Validators.pattern('^[0-9]+$')]],
            post: [employee.details?.post || ''],
            start_date_of_hire: [employee.details?.start_date_of_hire ? new Date(employee.details.start_date_of_hire) : null],
            contract_type: [this.contrats[this.mapContractType(employee.details?.contract_type)] || null],
            salary: [employee.details?.salary ?? 0, Validators.min(0)],
            role_id: [this.roles[employee.role_id - 2] || null, Validators.required],
            department: [this.departements[this.mapDepartment(employee.details?.department)] || null],
        });

        this.employeeDetailsDialog = true;
    }

    applyFilter(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement) {
            this.dt.filterGlobal(inputElement.value, 'contains');
        }
    }

    gotToAddEmployee() {
        this.router.navigate(['employees/addemployee']);
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

    clearSelectedEmployees() {
        this.selectedEmployees = [];
    }

    clearForm() {
        this.employeeForm.reset();
    }
}
