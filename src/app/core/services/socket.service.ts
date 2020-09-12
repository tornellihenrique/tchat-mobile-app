import { Injectable, OnDestroy } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message, Chat } from '../../models/chat.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const Ev = {
  CONNECT: 'user-connect',
  DISCONNECT: 'user-disconnect',
  MESSAGE_IN: 'message-in',
  MESSAGE_OUT: 'message-out',
};

@Injectable()
export class SocketService {
  url = environment.url;
  userId = new BehaviorSubject<string>(null);
  chats: BehaviorSubject<Chat[]>;

  constructor(private socket: Socket, private http: HttpClient) {}

  async findAllChats() {
    const chats = await this.http
      .get<Chat[]>(`${this.url}/api/chat`)
      .pipe(map(c => Chat.parseList(c)))
      .toPromise();
    console.log(chats);

    this.getChatsSubject().next(chats);
  }

  async findChatMessages(recipientId: string) {
    const chats = this.getChatsSubject().value;

    const res = await this.http
      .get<{ chat: Chat; messages: Message[] }>(`${this.url}/api/chat/${recipientId}`)
      .pipe(map(r => ({ chat: Chat.parse(r.chat), messages: Message.parseList(r.messages) })))
      .toPromise();

    for (const c of chats) {
      if (c.id === res.chat.id) {
        c.messages = res.messages;
        this.getChatsSubject().next(chats);

        return;
      }
    }

    chats.push({ ...res.chat, messages: res.messages });
    this.getChatsSubject().next(chats);
  }

  onLogout() {
    this.socket.emit(Ev.DISCONNECT);
    this.socket.removeAllListeners();
  }

  onLogin(userId: string) {
    this.socket.emit(Ev.CONNECT, userId);
    this.writeHandlers(userId);
  }

  onMessageOut(text: string, userId: string, recipientId: string) {
    if (userId && userId) {
      this.socket.emit(`${Ev.MESSAGE_OUT}`, { text, recipientId, userId });
    }
  }

  onMessageIn(chat: Chat, message: Message) {
    const chats = this.getChatsSubject().value;

    for (const c of chats) {
      if (c.id === chat.id) {
        c.lastMessage = chat.lastMessage;
        c.messages ? c.messages.push(message) : (c.messages = [message]);
        this.getChatsSubject().next(chats);

        return;
      }
    }

    chats.push({
      ...chat,
      messages: [message],
    });

    this.getChatsSubject().next(chats);
  }

  loadChats() {}

  loadChatMessages(id: string) {}

  writeHandlers(userId: string) {
    this.socket.on(`${Ev.MESSAGE_IN}-${userId}`, (chat: Chat, message: Message) => this.onMessageIn(chat, message));
  }

  getChatsSubject() {
    this.chats = this.chats || new BehaviorSubject<Chat[]>([]);
    return this.chats;
  }
}
