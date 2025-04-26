import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BaseUrl = environment.api


  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
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
    return this.http.get(this.BaseUrl + 'isSuperAdminConfigured', this.httpOption());
  }

  createUser(formData: FormData): Observable<any> {
    return this.http.post(`${this.BaseUrl}users/create`, formData,this.httpOption());
  }

}
