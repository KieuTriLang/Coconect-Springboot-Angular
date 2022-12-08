export interface IChatMessage {
  id: number | null;
  identityCode: string;
  senderName: string;
  receiverCode: string;
  content: string;
  status: string;
  postedTime: string;
  toRoom: boolean;
}
