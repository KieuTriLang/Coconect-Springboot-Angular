interface IMessage {
  id: number | null;
  content: string;
}
export interface IUserMess {
  identityCode: string;
  username: string;
  messages: IMessage[];
  postedTime: string;
}
