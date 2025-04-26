import { Component } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { MessageService } from 'primeng/api';
import { AuthService } from '../service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        RippleModule,
        AppFloatingConfigurator,
        CommonModule,
        ReactiveFormsModule,
    ],
    template: `
        <app-floating-configurator />
        <div class="flex min-h-screen mobile:m-6 flex-col justify-center px-6 py-12 lg:px-8">
            <div class="text-center sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    class="mx-auto h-20 w-auto"
                    src="/img/logo.svg"
                    alt="Drinhoseller"
                />
                <h2
                    class="mt-10 text-center text-2xl font-medium text-surface-900 dark:text-surface-0 mb-4"
                >
                    Bienvenue chez Drinhoseller
                </h2>
                <span class="text-muted-color font-medium"
                    >Connectez-vous pour continuer</span
                >
            </div>

            <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form
                    class="space-y-6"
                    [formGroup]="loginForm"
                    (ngSubmit)="onSubmit()"
                >
                    <!-- Phone Input (pInputText) -->
                    <div class="mb-6">
                        <label
                            for="phone"
                            class="block text-xl font-medium text-surface-900 dark:text-surface-0 mb-2"
                            >Téléphone</label
                        >
                        <div class="mt-2">
                            <input
                                type="tel"
                                pInputText
                                placeholder="Votre numéro"
                                formControlName="phone"
                                id="phone"
                                name="phone"
                                required
                                class="w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                            />
                        </div>
                    </div>

                    <!-- Password Input (p-password) -->
                    <div class="mb-6">
                        <label
                            for="password"
                            class="block text-xl font-medium text-surface-900 dark:text-surface-0 mb-2"
                            >Mot de passe</label
                        >
                        <div class="mt-2">
                            <p-password
                                id="password"
                                formControlName="password"
                                placeholder="Votre mot de passe"
                                toggleMask="true"
                                styleClass="mb-4"
                                [fluid]="true"
                                [feedback]="false"
                                class="w-full"
                            ></p-password>
                        </div>
                    </div>

                    <!-- Remember Me Checkbox -->
                    <div
                        class="flex items-center justify-between mt-2 mb-8 gap-8"
                    >
                        <div class="flex items-center">
                            <input
                                type="checkbox"
                                id="rememberme"
                                name="rememberme"
                                class="mr-2"
                            />
                            <label for="rememberme" class="text-sm"
                                >Se souvenir de moi</label
                            >
                        </div>
                        <a
                            href="#"
                            class="font-medium text-blue-600 hover:text-blue-500"
                            >Mot de passe oublié ?</a
                        >
                    </div>

                    <!-- Submit Button -->
                    <div class="">
                        <div>
                            <p-button
                                type="submit"
                                label="Connexion"
                                icon="pi pi-sign-in"
                                [loading]="loading"
                                severity="contrast"
                                class="w-full font-medium"
                                [style]="{ width: '100%' }"
                            ></p-button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
})
export class Login {
    loginForm!: FormGroup;
    erreurInput = false;
    responseError: any;
    loading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
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
            rememberme: [false],
        });
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

    showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.loading = true;
            const phone = this.loginForm.get('phone')?.value;
            const password = this.loginForm.get('password')?.value;
            const rememberme = this.loginForm.get('rememberme')?.value;

            const formData = new FormData();
            formData.append('phone', phone);
            formData.append('password', password);
            formData.append('rememberme', rememberme);

            this.authService.login(formData).subscribe({
                next: (response) => {
                    setTimeout(() => {
                        this.router.navigate(['/']);
                        localStorage.setItem('token', response.token);
                    }, 2000);
                },
                error: (error: HttpErrorResponse) => {
                    console.log('Erreur API reçue : ', error);
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

    reset_password() {
        this.router.navigate(['/resetpassword']);
    }
}
