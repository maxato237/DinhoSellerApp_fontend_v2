import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApplicationSettingService } from '../service/application.setting.service';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { CommonModule } from '@angular/common';
import { UserService } from '../service/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-settings',
    imports: [
        InputTextModule,
        ButtonModule,
        Dialog,
        FluidModule,
        FormsModule,
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        InputNumberModule,
        ReactiveFormsModule,
        CommonModule,
        DatePickerModule,
        SelectModule
    ],
    providers: [ConfirmationService],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
    suppliers: any[] = [];
    erreurInput = false;
    responseError: any;
    loading: boolean = false;
    appSettingForm!: FormGroup;
    accountDataForm!: FormGroup;
    product: any = {};
    appsettingDialog: boolean = false;
    accountDataDialog: boolean = false;
    user: any = {};
    settings: any = {};
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

    constructor(
        private Appsettings: ApplicationSettingService,
        private messageService: MessageService,
        private userService: UserService,
        private confirmationService: ConfirmationService,
        private fb: FormBuilder,
    ) {
        this.appSettingForm = this.fb.group({
            nc: ['', Validators.required],
            email: ['', Validators.required],
            orange: ['', Validators.required],
            mtn: [null, Validators.required],
            address: [null, [Validators.required, Validators.min(1)]],
            banque: [null, [Validators.required, Validators.min(1)]],
            compteb: [null, [Validators.min(0)]],
            TVA: ['', Validators.required],
            PRECOMPTE: ['', Validators.required],
            ECOMP: [''],
            BENEF: [null, Validators.required],
            PVC: [null, Validators.required],
        });

        this.accountDataForm = this.fb.group({
            lastname: ['', Validators.required],
            firstname: ['', Validators.required],
            phone: ['', [Validators.required]],
            role_id: [null, Validators.required],
            is_active: [true],
            date_of_birth: [''],
            genre: [''],
            address: [''],
            country: [''],
            city: [''],
            personnal_mail_address: ['', Validators.email],
            address_mail: ['', Validators.email],
            post: [''],
            start_date_of_hire: [''],
            contract_type: [''],
            salary: [null, Validators.min(0)],
            group: [''],
            department: [''],
        });
    }
    ngOnInit(): void {
        this.settings = this.Appsettings.settings;
        this.userService.accountDetails().subscribe({
            next: (data) => {
                this.user = data;
            },
            error: (error: HttpErrorResponse) => {
                this.showError(error.error.error);
            },
        });
    }

    showApplicationSettingsDialog() {
        this.appsettingDialog = true;
        this.appSettingForm = this.fb.group({
            NC: [this.settings.NC, Validators.required],
            Email: [this.settings.Email, Validators.required],
            Orange: [this.settings.Orange, Validators.required],
            MTN: [this.settings.MTN, Validators.required],
            Address: [this.settings.Address, [Validators.required]],
            Banque: [this.settings.Banque, [Validators.required]],
            CompteB: [this.settings.CompteB, [Validators.min(0)]],
            TVA: [this.settings.TVA * 100, Validators.required],
            PRECOMPTE: [this.settings.PRECOMPTE * 100, Validators.required],
            ECOMP: [this.settings.ECOMP * 100],
            BENEF: [this.settings.BENEF * 100, Validators.required],
            PVC: [this.settings.PVC * 100, Validators.required],
        });
    }
    showAccountDataDialog() {
        this.accountDataDialog = true;
        this.accountDataForm = this.fb.group({
            lastname: [this.user.lastname, Validators.required],
            firstname: [this.user.firstname, Validators.required],
            phone: [this.user.phone, [Validators.required]],
            password: [
                this.user.password,
                [Validators.required, Validators.minLength(6)],
            ],
            role_id: [this.user.role_id, Validators.required],
            date_of_birth: [
                this.user.details.date_of_birth
                    ? new Date(this.user.details.date_of_birth)
                    : null,
            ],
            genre: [this.user.details.genre],
            address: [this.user.details.address],
            country: [this.user.details.country],
            city: [this.user.details.city],
            personnal_mail_address: [
                this.user.details.personnal_mail_address,
                Validators.email,
            ],
            address_mail: [this.user.details.address_mail, Validators.email],
        });

        // Dans le template HTML, utilisez le pipe date pour afficher le format souhaité :
        // {{ accountDataForm.value.date_of_birth | date:'yyyy-MM-dd' }}
    }

    setApplicationSettings() {
        if (this.appSettingForm.valid) {
            this.Appsettings.updateSettings(this.appSettingForm.value).subscribe({
                next: (data) => {
                    this.settings = data.settings;
                    this.showSuccess('Les paramètres de l\'application ont été mis à jour avec succès.');
                    this.appsettingDialog = false;
                    this.clearAppSettingForm();
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                }
            });
        } else {
            this.erreurInput = true;
        }
    }

    setAccountData() {
        if (this.accountDataForm.valid) {
            this.userService.updateuser(this.accountDataForm.value).subscribe({
                next: (data) => {
                    this.showSuccess('Vos données ont été mises à jour avec succès.');
                    this.user = data;
                    this.accountDataDialog = false;
                    this.clearAccountForm();
                },
                error: (error: HttpErrorResponse) => {
                    this.showError(error.error.error);
                }
            });
        } else {
            this.erreurInput = true;
        }
    }

    cleardialog() {
        this.erreurInput = false;
    }

    clearAccountForm() {
        this.accountDataForm.reset();
    }
    clearAppSettingForm() {
        this.appSettingForm.reset();
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
}
