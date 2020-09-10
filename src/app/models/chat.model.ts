import { User } from './user.model';

export class Chat {
  id: string;
  name: string;
  owner: User;
  messages?: Message[];
}

export class Message {
  id?: string;
  chatId?: string;
  text: string;
  date?: Date;
  user?: User;
}
