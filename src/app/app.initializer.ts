import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { TOKEN_KEY, AuthService, USER_INFO } from './services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SocketService } from './services/socket.service';
import { User } from './models/user.model';

export function initApplication(
  storage: Storage,
  plt: Platform,
  helper: JwtHelperService,
  auth: AuthService,
  socket: SocketService,
) {
  return (): Promise<any> => {
    return new Promise<void>(async (resolve, reject) => {
      await plt.ready();

      const token = await storage.get(TOKEN_KEY);

      if (token) {
        const isExpired = helper.isTokenExpired(token);

        if (!isExpired) {
          const user: User = await storage.get(USER_INFO);

          if (user) {
            socket.onLogin(user.id);
            auth.getAuthStateSubject().next(user);
          }
        }
      }

      resolve();
    });
  };
}
