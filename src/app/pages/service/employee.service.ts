import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

    BaseUrl = environment.api;

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

    addEmployee(data: any): Observable<any> {
      return this.http.post(`${this.BaseUrl}users/addemployee`, data, this.httpOption());
    }

    updateUsers(data: any, id:any): Observable<any> {
      return this.http.put(`${this.BaseUrl}users/update/${id}`, data, this.httpOption());
    }

    getAllUsers(): Observable<any> {
      return this.http.get(`${this.BaseUrl}users/all`, this.httpOption());
    }

    getUserById(id:number): Observable<any> {
      return this.http.get(`${this.BaseUrl}users/getUserById/${id}`, this.httpOption())
    }

    deleteUser(id:number): Observable<any>{
      return this.http.delete(`${this.BaseUrl}users/delete/${id}`, this.httpOption())
    }
}
