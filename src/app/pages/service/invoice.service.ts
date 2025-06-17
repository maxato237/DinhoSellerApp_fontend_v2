import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class InvoiceService {
    BaseUrl = environment.api;

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: any,
    ) {}

    httpOption() {
        let token: string | null = null;

        if (isPlatformBrowser(this.platformId)) {
            token = localStorage.getItem('token');
        }

        const httpOptions3 = {
            headers: new HttpHeaders({
                Authorization: `Bearer ${token}`,
            }),
        };

        return httpOptions3;
    }

    getInvoiceCode(): Observable<any> {
        return this.http.get(`${this.BaseUrl}invoices/code`, this.httpOption());
    }

    addInvoice(invoice:any):Observable<any>{
        return this.http.post(`${this.BaseUrl}invoices/add`,invoice, this.httpOption())
    }
}
