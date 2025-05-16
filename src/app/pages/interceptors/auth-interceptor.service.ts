import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    HttpErrorResponse,
    HttpHandlerFn,
    HttpInterceptorFn,
    HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { MessageService } from 'primeng/api';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<any>,
    next: HttpHandlerFn,
): Observable<any> => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            if (error.status === 401 || error.status === 422) {
                authService.logout();

                setTimeout(() => {
                    router.navigate(['/auth/signin']);
                }, 2000);
            }

            return throwError(() => error);
        }),
    );
};
