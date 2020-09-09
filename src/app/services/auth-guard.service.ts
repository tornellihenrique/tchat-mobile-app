import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.auth.isAuthenticated();

    if (!isAuthenticated) {
      this.router.navigate(['initial']);
    }

    return isAuthenticated;
  }
}
