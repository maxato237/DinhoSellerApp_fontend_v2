import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

const httpOptions3 = {
    headers: new HttpHeaders({}),
    withCredentials: true,
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    BaseUrl = environment.api;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) {}

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        const token = this.getToken();
        return token ? this.isTokenValid(token) : false;
    }

    private isTokenValid(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp;
            return exp && Date.now() < exp * 1000;
        } catch (err) {
            return false;
        }
    }

    login(formData: FormData): Observable<any> {
        return this.http.post(
            `${this.BaseUrl}auth/login`,
            formData,
            httpOptions3,
        );
    }

    logout() {
        localStorage.removeItem('token');
    }
}
