import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('IonContent', { static: true }) content: IonContent;
  paramData: any;
  msgList: any;
  userName = 'Teste';
  userInput = '';
  User = 'Me';
  toUser = 'HealthBot';
  startTyping: any;
  loader: boolean;

  constructor(public activRoute: ActivatedRoute, private socket: SocketService) {
    this.activRoute.params.subscribe(params => {
      console.log(params);
      this.paramData = params;
      this.userName = params.name;
    });

    this.msgList = [
      // {
      //   userId: 'HealthBot',
      //   userName: 'HealthBot',
      //   userAvatar: '../../assets/chat/chat4.jpg',
      //   time: '12:00',
      //   message: 'Hello, have you seen this great chat UI',
      //   id: 0,
      // },
    ];
  }

  ngOnInit() {}

  sendMsg() {
    if (this.userInput && this.userInput !== '') {
      // this.msgList.push({
      //   userId: this.toUser,
      //   userName: this.toUser,
      //   userAvatar: this.paramData.image ? this.paramData.image : '../../assets/chat/chat4.jpg',
      //   time: '12:01',
      //   message: this.userInput,
      //   id: this.msgList.length + 1,
      // });

      this.socket.onMessageOut(this.userInput, '5f5978bb6281c01da4634be5');

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
    console.log(event);
    this.startTyping = event.target.value;
    this.scrollDown();
  }
}
