import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  private settings: Record<string, string> = {};
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  loadSettings(): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/setting`, {
      observe: 'response',
    });
  }

  mapToSettings(data: any[]): void {
    this.settings = {};
    for (const item of data) {
      this.settings[item.key] = item.value;
    }
  }

  get(key: string): string | undefined {
    return this.settings[key];
  }

  /**
   * Lấy toàn bộ setting (dưới dạng object map)
   */
  getAll(): Record<string, string> {
    return this.settings;
  }
}
