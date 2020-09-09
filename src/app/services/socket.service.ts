import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

const EVENTS = {
  COMMUNITY_CHAT: 'COMMUNITY_CHAT',
  USER_CONNECTED: 'USER_CONNECTED',
  MESSAGE_RECIEVED: 'MESSAGE_RECIEVED',
  MESSAGE_SENT: 'MESSAGE_SENT',
  USER_DISCONNECTED: 'USER_DISCONNECTED',
  TYPING: 'TYPING',
  VERIFY_USER: 'VERIFY_USER',
  LOGOUT: 'LOGOUT',
  PRIVATE_MESSAGE: 'PRIVATE_MESSAGE',
  DISCONNECT: 'DISCONNECT',
};

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  constructor(private socket: Socket) {
    this.socket.connect();
  }

  onLogin(userId: string) {
    this.socket.emit(EVENTS.VERIFY_USER, userId, val => {
      console.log(val);
    });
  }
}
