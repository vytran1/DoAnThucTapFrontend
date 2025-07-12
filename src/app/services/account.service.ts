import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChangePasswordRequest } from '../model/account/change-password-request.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  host: string = environment.apiUrl;
  private imageSubject = new BehaviorSubject<string | null>(null);
  public image$ = this.imageSubject.asObservable();
  constructor(private httpClient: HttpClient) {}

  public getInformationOfCurrentLoggedUser(): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/accounts/info`, {
      observe: 'response',
    });
  }

  public changePassword(
    requestBody: ChangePasswordRequest
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/accounts/change/password`,
      requestBody,
      { observe: 'response' }
    );
  }

  public getImage(): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/accounts/image`, {
      responseType: 'text',
      observe: 'response',
    });
  }

  public changeImage(file: File): Observable<HttpResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);

    return new Observable((observer) => {
      this.httpClient
        .post(`${this.host}/api/accounts/change/image`, formData, {
          observe: 'response',
          responseType: 'text' as 'json',
        })
        .subscribe({
          next: (res) => {
            const newFileName = res.body as string; // backend trả tên ảnh mới
            this.imageSubject.next(newFileName); // phát cho các component khác
            observer.next(res); // trả response cho người gọi (component)
            observer.complete(); // kết thúc stream
          },
          error: (err) => observer.error(err),
        });
    });
  }
}
