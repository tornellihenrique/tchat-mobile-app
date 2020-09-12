import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from 'src/app/core/services/socket.service';
import { Router } from '@angular/router';
import { Chat } from 'src/app/models/chat.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  subscription: Subscription;

  segmentTab: any;
  chats: Chat[] = [];

  constructor(public socket: SocketService, private router: Router) {}

  ngOnInit() {
    this.socket.findAllChats();

    this.subscription = this.socket.getChatsSubject().subscribe(chats => {
      console.log(chats);
      this.chats = chats;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  segmentChanged(event: any) {
    this.segmentTab = event.detail.value;
  }

  goforChat(chat: Chat) {
    if (chat && chat.recipient) {
      this.router.navigate(['chat', chat.recipient.id]);
    }
  }
}
