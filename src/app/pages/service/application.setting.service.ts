import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicationSettingService {

    private config: any;

    constructor(private http: HttpClient) {}

    loadConfig() {
      return firstValueFrom(
        this.http.get('application.setting.json')
      ).then(config => {
        this.config = config;
      });
    }

    get settings() {
      return this.config;
    }
}
