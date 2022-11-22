export class UserMess {
  constructor(
    public identityCode: string,
    public username: string,
    public messages: string[],
    public postedTime: string
  ) {}
}
