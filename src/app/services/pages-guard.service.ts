import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PagesGuardService implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isAuthenticated = this.auth.isAuthenticated();

    if (isAuthenticated) {
      this.router.navigate(['home']);
    }

    return !isAuthenticated;
  }
}
