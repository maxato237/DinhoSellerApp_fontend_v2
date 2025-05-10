import { Component } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormBuilder,
    Validators,
    FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FluidModule } from 'primeng/fluid';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ClientService } from '../../service/client.service';
import { EmployeeService } from '../../service/employee.service';
import { DatePickerModule } from 'primeng/datepicker';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
    selector: 'app-addemployee',
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        ReactiveFormsModule,
        FormsModule,
        FluidModule,
        SelectModule,
        InputNumberModule,
        CheckboxModule,
        DatePickerModule,
    ],
    templateUrl: './addemployee.component.html',
    styleUrl: './addemployee.component.scss',
})
export class AddemployeeComponent {
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

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private messageService: MessageService,
        private clientService: ClientService,
        private employeeService: EmployeeService,
    ) {
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

    onSubmit() {
        if (this.employeeForm.invalid) {
            this.erreurInput = true;
            this.showError('Veuillez remplir tous les champs obligatoires.');
        } else {
            this.erreurInput = false;
            console.log(this.employeeForm.value);
            this.loading = true;
            this.employeeService.addEmployee(this.employeeForm.value).subscribe({
                next: () => {
                    this.showSuccess('Employé ajouté avec succès');
                },
                error: (error : HttpErrorResponse) => {
                    this.showError(error.error.error);
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
        this.employeeForm.reset();
    }

    goToEmployeeList() {
        this.router.navigate(['employees/employeeslist']);
    }
}
