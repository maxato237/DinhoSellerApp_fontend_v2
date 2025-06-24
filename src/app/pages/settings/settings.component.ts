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

    constructor(
        private settings: ApplicationSettingService,
        private messageService: MessageService,
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
            password: ['', [Validators.required, Validators.minLength(6)]],
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

    }

    showApplicationSettingsDialog() {
        this.appsettingDialog = true;
    }
    showAccountDataDialog() {
        this.accountDataDialog = true;
    }

    setApplicationSettings() {
        if (this.appSettingForm.valid) {
        } else {
            this.erreurInput = true;
        }
    }
    setAccountData() {
        if (this.accountDataForm.valid) {
        } else {
            this.erreurInput = true;
        }
    }
    cleardialog() {
        this.erreurInput = false;
    }

    clearAccountForm() {
        this.accountDataForm.reset()
    }
    clearAppSettingForm() {
        this.appSettingForm.reset()
    }
}
