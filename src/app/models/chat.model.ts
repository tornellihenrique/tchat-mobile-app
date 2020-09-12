import { User } from './user.model';

export class Chat {
  id: string;
  user: User;
  recipient: User;
  messages?: Message[];
  lastMessage?: Message;

  public static parse(chat: Chat): Chat {
    if (!chat) {
      return null;
    }

    return {
      ...chat,
      messages: Message.parseList(chat.messages || []),
      lastMessage: Message.parse(chat.lastMessage),
    };
  }

  public static parseList(chats: Chat[]): Chat[] {
    if (!chats) {
      return [];
    }

    return chats.map(c => Chat.parse(c));
  }
}

export class Message {
  id?: string;
  chat?: string;
  text: string;
  date?: Date;
  user?: User;

  public static parse(message: Message): Message {
    if (!message) {
      return null;
    }

    return {
      ...message,
      date: new Date(message.date),
    };
  }

  public static parseList(messages: Message[]): Message[] {
    if (!messages) {
      return [];
    }

    return messages.map(m => Message.parse(m));
  }
}
