import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

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

    addCient(data: any): Observable<any> {
      return this.http.post(`${this.BaseUrl}clients/add`, data, this.httpOption());
    }

    updateCient(data: any, id:any): Observable<any> {
      return this.http.put(`${this.BaseUrl}clients/update/${id}`, data, this.httpOption());
    }

    getAllClients(): Observable<any> {
      return this.http.get(`${this.BaseUrl}clients/all`, this.httpOption());
    }

    getCientById(id:number): Observable<any> {
      return this.http.get(`${this.BaseUrl}clients/getCientById/${id}`, this.httpOption())
    }

    deleteCient(id:number): Observable<any>{
      return this.http.delete(`${this.BaseUrl}clients/delete/${id}`, this.httpOption())
    }
}
