import { IChatMessage } from './chat-message';
import { ITab } from './tab';
export interface IConversation {
  conversation: ITab;
  messages: IChatMessage[];
}
