import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { TOKEN_KEY, AuthService } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/user.model';

export function initApplication(storage: Storage, plt: Platform, helper: JwtHelperService, auth: AuthService) {
  return (): Promise<any> => {
    return new Promise<void>(async (resolve, reject) => {
      await plt.ready();

      const token = await storage.get(TOKEN_KEY);

      if (token) {
        const decoded = helper.decodeToken(token);
        const isExpired = helper.isTokenExpired(token);

        if (!isExpired) {
          auth.authenticationState.next(decoded);
        } else {
          auth.authenticationState.next(null);
        }
      } else {
        auth.authenticationState.next(null);
      }

      resolve();
    });
  };
}
