import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { ApplicationSettingService } from './application.setting.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BaseUrl = environment.api


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any,
    private appConfigService: ApplicationSettingService,
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

    return httpOptions3
  }

  checkSuperAdminConfigured(): Observable<any> {
    const isConfigured = this.appConfigService.settings.isSuperAdminConfigured;
    return of({ isSuperAdminConfigured: isConfigured });
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.BaseUrl}users/create`, formData,this.httpOption());
  }

}
