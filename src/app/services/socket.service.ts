import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message, Chat } from '../models/chat.model';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

const Ev = {
  CONNECT: 'user-connect',
  DISCONNECT: 'user-disconnect',
  MESSAGE_IN: 'message-in',
  MESSAGE_OUT: 'message-out',
};

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  connectedUserId = new BehaviorSubject<string>(null);
  chats = new BehaviorSubject<Chat[]>([]);

  constructor(private socket: Socket, private auth: AuthService) {
    this.socket.connect();
  }

  onLogout() {
    this.socket.emit(Ev.DISCONNECT);
    this.socket.removeAllListeners();
    this.connectedUserId.next(null);
  }

  onLogin(userId: string) {
    this.socket.emit(Ev.CONNECT, userId);
    this.writeHandlers(userId);
    this.connectedUserId.next(userId);
  }

  onMessageOut(text: string, recipientId: string) {
    const user = this.auth.getAuthStateSubject().value;

    if (user) {
      this.socket.emit(`${Ev.MESSAGE_OUT}`, { text, recipientId, userId: user.id });
    }
  }

  onMessageIn(chat: Chat, message: Message) {
    console.log(chat, message);
    return;

    for (const c of this.chats) {
      if (c.id === message.chatId) {
        c.messages.push(message);
        c.messages = c.messages.sort((a, b) => a.date.getTime() - b.date.getTime());

        return;
      }
    }

    this.chats.push({
      ...chat,
      messages: [message],
    });
  }

  loadChats() {}

  loadChatMessages(id: string) {}

  writeHandlers(userId: string) {
    this.socket.on(`${Ev.MESSAGE_IN}-${userId}`, this.onMessageIn);
  }
}
