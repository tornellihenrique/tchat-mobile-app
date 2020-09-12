import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Interceptor } from './interceptor.module';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthService } from './services/auth.service';
import { PagesGuardService } from './services/pages-guard.service';
import { SocketService } from './services/socket.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, Interceptor],
  providers: [AuthGuardService, AuthService, PagesGuardService, SocketService],
})
export class CoreModule {}
