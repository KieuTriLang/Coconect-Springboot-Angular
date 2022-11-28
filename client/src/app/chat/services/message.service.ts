import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  regexColor =
    /(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6})\b|(?:rgb|hsl)a?\([^\\)]*\)/gi;
  regexLink =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  regexProtocol = /^(http|https):\/\//;
  constructor() {}

  transformMessage(text: string): string {
    if (new RegExp(this.regexColor).test(text)) {
      text = this.transformColor(text);
    }
    if (new RegExp(this.regexLink).test(text)) {
      text = this.transformLink(text);
    }
    return text;
  }
  transformColor(text: string): string {
    return text.replace(
      this.regexColor,
      (color) =>
        `<p class="message-color" m-title="${color}"  style="background:${color};"></p>`
    );
  }

  transformLink(text: string): string {
    return text.replace(
      this.regexLink,
      (link) =>
        `<a class="message-link" href="${this.addProtocol(
          link
        )}" target="_blank">${link}</a>`
    );
  }

  addProtocol(text: string): string {
    if (!new RegExp(this.regexProtocol).test(text)) {
      return `https://${text}`;
    }
    return text;
  }
}
