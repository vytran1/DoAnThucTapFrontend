import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Province } from '../model/province/province.model';
import { District } from '../model/district/district.model';

@Injectable({
providedIn: 'root'
})
export class LocationService {
private apiUrl = 'http://localhost:8080/api/v1';
constructor(private http: HttpClient) { }
getProvinces(): Observable<Province[]> {
return this.http.get<Province[]>(`${this.apiUrl}/provinces`);
}
getDistrictsByProvince(provinceId: number): Observable<District[]> {
return this.http.get<District[]>(`${this.apiUrl}/provinces/${provinceId}/districts`);
}
}