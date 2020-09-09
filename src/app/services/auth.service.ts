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
import { SocketService } from './socket.service';

export const TOKEN_KEY = 'access_token';
export const EMAIL_KEY = 'email';
export const PASSWORD_KEY = 'password';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.url;
  authenticationState = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private storage: Storage,
    private plt: Platform,
    private alertController: AlertController,
    private router: Router,
    private socketService: SocketService,
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

      this.authenticationState.next(user);
      this.socketService.onLogin(user.id);

      console.log(this.authenticationState.value);

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
    ]).then(() => {
      this.authenticationState.next(null);
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
    return !!this.authenticationState.value;
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
