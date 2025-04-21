import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

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

      return httpOptions3;
    }

    addProduct(newProduct: any):Observable<any>{
      return this.http.post(`${this.BaseUrl}stocks/add`, newProduct, this.httpOption());
    }

    updateProduct(updatedProduct: any, id:any): Observable<any> {
      return this.http.put(`${this.BaseUrl}stocks/update/${id}`, updatedProduct, this.httpOption());
    }

    getAllProducts(): Observable<any> {
      return this.http.get(`${this.BaseUrl}stocks/all`, this.httpOption());
    }

    getProductById(id:number): Observable<any> {
      return this.http.get(`${this.BaseUrl}stocks/getProductById/${id}`, this.httpOption())
    }


    deleteProduct(id:number): Observable<any>{
      return this.http.delete(`${this.BaseUrl}stocks/delete/${id}`, this.httpOption())
    }

    get_products_supplied_by_product(productName: string): Observable<any> {
      return this.http.get(`${this.BaseUrl}stocks/suppliers_by_product/${productName}`, this.httpOption())
    }
}
