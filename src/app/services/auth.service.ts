import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthRequest } from '../model/security/auth-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private host = environment.apiUrl;
  private jwtToken: any = null;
  private jwtHelper = new JwtHelperService();

  constructor(private httpClient: HttpClient) {}

  public login(authRequest: AuthRequest): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/auth/token`, authRequest, {
      observe: 'response',
    });
  }

  public logout() {
    localStorage.removeItem('token');
  }

  public saveToken(token: string) {
    this.jwtToken = token;
    localStorage.setItem('token', token);
  }

  public getToken() {
    return localStorage.getItem('token');
  }

  public isLogged() {
    const token = this.getToken();
    this.jwtToken = token;

    if (this.jwtToken != null && this.jwtToken !== '') {
      if (this.jwtHelper.decodeToken(this.jwtToken).sub != null || '') {
        if (!this.jwtHelper.isTokenExpired(this.jwtToken)) {
          return true;
        }
      }
    }
    this.logout();
    return false;
  }

  public getRole() {
    const token = this.getToken();

    if (token) {
      const payload = this.jwtHelper.decodeToken(token);
      console.log(payload); // hoặc return payload.role nếu bạn có field role
      return payload.role;
    } else {
      console.warn('Token not found in localStorage');
      return null;
    }
  }

  public getId() {
    const token = this.getToken();

    if (token) {
      const payload = this.jwtHelper.decodeToken(token);
      const sub = payload?.sub;

      if (sub) {
        const parts = sub.split(',');
        return parts[0] || null; // 👈 phần tử thứ 3 (index 2)
      }
    }

    return null;
  }

  public getInventoryCode() {
    const token = this.getToken();

    if (token) {
      const payload = this.jwtHelper.decodeToken(token);
      const sub = payload?.sub;

      if (sub) {
        const parts = sub.split(',');
        return parts[2] || null; // 👈 phần tử thứ 3 (index 2)
      }
    }

    return null;
  }

  public isSuperAdmin() {
    const role = this.getRole();

    if (role == 'SUPER_ADMIN') {
      return true;
    }

    return false;
  }

  public isDirector() {
    const role = this.getRole();

    if (role == 'DIRECTOR') {
      return true;
    }

    return false;
  }

  public isEMPLOYEE() {
    const role = this.getRole();

    if (role == 'EMPLOYEE') {
      return true;
    }

    return false;
  }
}
