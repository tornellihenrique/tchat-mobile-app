import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage';
import { Platform, AlertController } from '@ionic/angular';
import { Credentials } from '../models/credentials.model';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

export const TOKEN_KEY = 'access_token';
export const EMAIL_KEY = 'email';
export const PASSWORD_KEY = 'password';
export const USER_INFO = 'user_info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.url;
  private authenticationState: BehaviorSubject<User>;

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private plt: Platform,
    private alertController: AlertController,
    private router: Router,
  ) {}

  register(user: User, save: boolean = true) {
    return this.http.post(`${this.url}/api/register`, user).pipe(
      tap(val => {
        this.login({ email: user.email, password: user.password }, save);
      }),
    );
  }

  async login(credentials?: Credentials, save: boolean = true) {
    const aux = credentials || (await this.getSavedCredentials());
    if (!aux) {
      this.logout();
      return false;
    }

    try {
      const res: any = await this.http.post(`${this.url}/api/login`, aux).toPromise();

      this.storage.set(TOKEN_KEY, res.token);

      if (save) {
        this.storage.set(EMAIL_KEY, credentials.email);
        this.storage.set(PASSWORD_KEY, btoa(credentials.password));
      }

      const user = User.getUserFromResponse(res);

      this.storage.set(USER_INFO, user);
      this.getAuthStateSubject().next(user);

      this.router.navigate(['home']);

      return true;
    } catch (e) {
      return false;
    }
  }

  logout() {
    Promise.all([
      this.storage.remove(TOKEN_KEY),
      this.storage.remove(EMAIL_KEY),
      this.storage.remove(PASSWORD_KEY),
      this.storage.remove(USER_INFO),
    ]).then(() => {
      this.getAuthStateSubject().next(null);
      this.router.navigate(['initial']);
    });
  }

  getSpecialData() {
    return this.http.get(`${this.url}/api/special`).pipe(
      catchError(e => {
        console.error(e);
        throw new Error(e);
      }),
    );
  }

  isAuthenticated() {
    return !!this.getAuthStateSubject().value;
  }

  getAuthStateSubject() {
    this.authenticationState = this.authenticationState || new BehaviorSubject<User>(null);
    return this.authenticationState;
  }

  async getSavedCredentials() {
    const email = await this.storage.get(EMAIL_KEY);
    const password = atob(await this.storage.get(PASSWORD_KEY));

    if (!email || !password) {
      return null;
    }

    return { email, password };
  }
}
