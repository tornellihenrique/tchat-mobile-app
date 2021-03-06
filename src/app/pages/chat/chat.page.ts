import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/core/services/socket.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/models/chat.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  s1: Subscription;
  s2: Subscription;

  @ViewChild('IonContent', { static: true }) content: IonContent;
  userInput = '';
  startTyping: any;
  loader: boolean;

  recipientId: string;
  chat: Chat;
  user: User;

  isScrollInTopBottom = false;

  constructor(public activRoute: ActivatedRoute, private socket: SocketService, private authService: AuthService) {
    this.scrollDown();
  }

  ngOnInit() {
    this.recipientId = this.activRoute.snapshot.params.id;

    this.socket.findChatMessages(this.recipientId);

    this.s1 = this.authService.getAuthStateSubject().subscribe(user => {
      this.user = user;
    });

    this.s2 = this.socket.getChatsSubject().subscribe(chats => {
      this.chat = chats.find(c => c.recipient.id === this.recipientId);

      if (this.isScrollInTopBottom) {
        this.scrollDown();
      }
    });
  }

  ngOnDestroy() {
    this.s1.unsubscribe();
    this.s2.unsubscribe();
  }

  sendMsg() {
    if (this.chat && this.chat.recipient && this.user && this.userInput && this.userInput !== '') {
      // this.msgList.push({
      //   userId: this.toUser,
      //   userName: this.toUser,
      //   userAvatar: this.paramData.image ? this.paramData.image : '../../assets/chat/chat4.jpg',
      //   time: '12:01',
      //   message: this.userInput,
      //   id: this.msgList.length + 1,
      // });

      this.socket.onMessageOut(this.userInput, this.user.id, this.chat.recipient.id);

      this.userInput = '';
      this.scrollDown();
    }
  }

  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 50);
  }

  userTyping(event: any) {
    this.startTyping = event.target.value;
  }

  get messages() {
    return this.chat ? this.chat.messages : [];
  }

  async logScrolling($event: any) {
    if ($event.target.localName !== 'ion-content') {
      return;
    }

    const scrollElement = await $event.target.getScrollElement();
    const scrollHeight = scrollElement.scrollHeight - scrollElement.clientHeight;

    const currentScrollDepth = $event.detail.scrollTop;

    const targetPercent = 80;

    const triggerDepth = (scrollHeight / 100) * targetPercent;

    this.isScrollInTopBottom = currentScrollDepth > triggerDepth;
  }
}
