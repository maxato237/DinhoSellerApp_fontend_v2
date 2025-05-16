import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';

import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { Toast } from 'primeng/toast';
import { UserService } from '../service/user.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-setup',
    standalone: true,
    imports: [
        BadgeModule,
        AvatarModule,
        InputTextModule,
        CardModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        AppFloatingConfigurator,
    ],
    templateUrl: './setup.component.html',
    styleUrl: './setup.component.scss',
})
export class SetupComponent implements OnInit {
    setupForm!: FormGroup;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private messageService: MessageService,
        private router: Router,
    ) {}
    ngOnInit(): void {
        this.setupForm = this.fb.group(
            {
                lastname: ['', [Validators.required, Validators.minLength(2)]],
                firstname: ['', [Validators.required, Validators.minLength(2)]],
                email: [
                    '',
                    [
                        Validators.pattern(
                            '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                        ),
                    ],
                ],
                phone: [
                    '',
                    [Validators.required, Validators.pattern('^[0-9]{9,15}$')],
                ],
                password: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(6),
                        this.customPasswordValidator,
                    ],
                ],
                confirmpassword: ['', Validators.required],
            },
            { validator: this.passwordMatchValidator.bind(this) },
        );
    }

    passwordMatchValidator(form: FormGroup) {
        const password = form.get('password');
        const confirmpassword = form.get('confirmpassword');

        if (!password || !confirmpassword) {
            return null;
        }

        const mismatch = password.value !== confirmpassword.value;
        if (mismatch) {
            confirmpassword.setErrors({ mismatch: true });
        } else {
            confirmpassword.setErrors(null); // Clear any previous error
        }

        return mismatch ? { mismatch: true } : null;
    }

    customPasswordValidator(
        control: AbstractControl,
    ): { [key: string]: boolean } | null {
        const password: string = control.value;
        const hasUppercase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasNumber = /\d/.test(password);

        return hasUppercase && hasSpecialChar && hasNumber
            ? null
            : { invalidPassword: true };
    }

    showSuccess() {
        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Enregistrement effectué avec succès',
        });
    }

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
        });
    }

    onSubmit() {
        if (this.setupForm.valid) {
            this.loading = true;
            const lastname = this.setupForm.get('lastname')?.value;
            const firstname = this.setupForm.get('firstname')?.value;
            const email = this.setupForm.get('email')?.value;
            const phone = this.setupForm.get('phone')?.value;
            const password = this.setupForm.get('password')?.value;
            const confirmpassword =
                this.setupForm.get('confirmpassword')?.value;

            if (password != confirmpassword) {
                this.erreurInput = true;
                this.showError('Les mots de passe ne correspondent pas');
                return;
            }

            const formData = new FormData();
            formData.append('lastname', lastname);
            formData.append('firstname', firstname);
            formData.append('email', email);
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('role_id', '1');

            this.userService.createUser(formData).subscribe({
                next: (response) => {
                    this.showSuccess();
                    setTimeout(() => {
                        this.router.navigate(['/auth/' + 'signin']);
                    }, 2000);
                },
                error: (error: HttpErrorResponse) => {
                    if (error.error && error.error.message) {
                        this.responseError = error.error.message;
                    } else {
                        this.responseError =
                            'Une erreur inconnue est survenue.';
                    }
                    this.loading = false;
                    this.showError(this.responseError);
                },
            });
        } else {
            this.erreurInput = true;
        }
    }

    clearForm() {
        this.setupForm.reset();
    }
}
