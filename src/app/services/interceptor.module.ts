import { Injectable, NgModule } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { AlertController } from '@ionic/angular';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private alertController: AlertController) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(e => {
        if (e instanceof HttpErrorResponse) {
          if (e.status !== 401) {
            this.showAlert(e.error.msg);
            return of(null);
          }

          return from(this.auth.login()).pipe(
            switchMap(val => {
              if (val) {
                return next.handle(request);
              }

              this.auth.logout();
              return of(null);
            }),
          );
        }
      }),
    );
  }

  showAlert(message: string) {
    this.alertController
      .create({
        message,
        header: 'Error',
        buttons: ['OK'],
      })
      .then(alert => alert.present());
  }
}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})
export class Interceptor {}
