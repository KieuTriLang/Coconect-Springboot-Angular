export class ChatMessage {
  constructor(
    public identityCode: string,
    public username: string,
    public receiverName: string,
    public connected: boolean,
    public message: string
  ) {}
}
