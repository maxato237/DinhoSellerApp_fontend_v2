import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ApplicationSettingService {
    private config: any;
    configIncomplete: boolean = false;

    private readonly API_URL = 'http://localhost:5000/api/auth';

    constructor(private http: HttpClient) {}

    loadConfig(): Promise<any> {
    return firstValueFrom(this.http.get(this.API_URL + '/all')).then(config => {
        this.config = config;

        const requiredFields = [
        'BENEF', 'ECOMP', 'PRECOMPTE', 'PVC', 'TVA',
        'NC', 'Email', 'Banque', 'CompteB', 'Orange',
        'MTN', 'Address'
        ];

        this.configIncomplete = requiredFields.some(
        field => this.config[field] === null || this.config[field] === ''
        );

        return config;
    });
    }

    get settings() {
        return this.config;
    }

    updateSettings(update: Partial<any>): Observable<any> {
        this.config = { ...this.config, ...update };
        console.log(this.config);
        return this.http.put(this.API_URL + '/update', update);
    }

    isConfigurationComplete(): Observable<{ isComplete: boolean }> {
        const requiredFields = [
            'BENEF',
            'ECOMP',
            'PRECOMPTE',
            'PVC',
            'TVA',
            'NC',
            'Email',
            'Banque',
            'CompteB',
            'Orange',
            'MTN',
            'Address',
        ];

        const isValid =
            this.config &&
            requiredFields.every(
                (field) =>
                    this.config[field] !== null && this.config[field] !== '',
            );

        return of({ isComplete: isValid });
    }
}
