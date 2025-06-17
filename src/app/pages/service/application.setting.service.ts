import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationSettingService {

  private config: any;

  private readonly API_URL = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<any> {
    return firstValueFrom(this.http.get(this.API_URL + '/all')).then(config => {
      this.config = config;
      return config;
    });
  }

  get settings() {
    return this.config;
  }

  updateSettings(update: Partial<any>): Observable<any> {
    this.config = { ...this.config, ...update };
    return this.http.put(this.API_URL + '/update', update);
  }
}

