export class ChatMessage {
  constructor(
    public identityCode: string,
    public senderName: string,
    public receiverCode: string,
    public content: string,
    public status: string,
    public postedTime: string
  ) {}
}
