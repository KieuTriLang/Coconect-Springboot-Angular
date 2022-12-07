export class ChatMessage {
  constructor(
    public id: number | null,
    public identityCode: string,
    public senderName: string,
    public receiverCode: string,
    public content: string,
    public status: string,
    public postedTime: string,
    public toRoom: boolean
  ) {}
}
