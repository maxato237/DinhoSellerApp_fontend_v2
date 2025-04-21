import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
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

    addSupplier(data: any): Observable<any> {
      return this.http.post(`${this.BaseUrl}suppliers/add`, data, this.httpOption());
    }

    updateSupplier(data: any, id:any): Observable<any> {
      return this.http.put(`${this.BaseUrl}suppliers/update/${id}`, data, this.httpOption());
    }

    getAllSuppliers(): Observable<any> {
      return this.http.get(`${this.BaseUrl}suppliers/all`, this.httpOption());
    }

    getSupplierById(id:number): Observable<any> {
      return this.http.get(`${this.BaseUrl}suppliers/getSupplierById/${id}`, this.httpOption())
    }

    get_products_supplied_by_supplier(name:string): Observable<any>{
      return this.http.get(`${this.BaseUrl}suppliers/products_supplied/${name}`, this.httpOption())
    }

    deleteSupplier(id:number): Observable<any>{
      return this.http.delete(`${this.BaseUrl}suppliers/delete/${id}`, this.httpOption())
    }
}
