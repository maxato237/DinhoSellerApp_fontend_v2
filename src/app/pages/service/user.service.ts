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
    return this.http.get(`${this.BaseUrl}auth/all`, this.httpOption());
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.BaseUrl}users/create`, formData,this.httpOption());
  }

  updateuser(formData: FormData): Observable<any> {
    return this.http.put(`${this.BaseUrl}users/updatemydetails`, formData, this.httpOption());
  }

  getuserById(id: string): Observable<any> {
    return this.http.get(`${this.BaseUrl}users/userById/${id}`, this.httpOption());
  }

  accountDetails(): Observable<any> {
    return this.http.get(`${this.BaseUrl}users/accountDetails`, this.httpOption());
  }

}
