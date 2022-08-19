import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { MessagesResult } from '../../models/v4/messages/messagesResult';
import { MessageResult } from '../../models/v4/messages/messageResult';
import { SendMessageResult } from '../../models/v4/messages/sendMessageResult';
import { MessageRecipientInput } from '../../models/v4/messages/messageRecipientInput';
import { RespondToMessageResult } from '../../models/v4/messages/respondToMessageResult';
import { DeleteMessageResult } from '../../models/v4/messages/deleteMessageResult';
import { GetRecipientsResult } from '../../models/v4/messages/getRecipientsResult';


@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getInboxMessages(): Observable<MessagesResult> {
    const url = this.config.apiUrl + '/Messages/GetInboxMessages';
    return this.http.get<MessagesResult>(url);
  }

  public getOutboxMessages(): Observable<MessagesResult> {
    const url = this.config.apiUrl + '/Messages/GetOutboxMessages';
    return this.http.get<MessagesResult>(url);
  }

  public getMessage(messageId: string): Observable<MessageResult> {
    const url = this.config.apiUrl + '/Messages/GetMessage?messageId=' + messageId;
    return this.http.get<MessageResult>(url);
  }

  public sendMessage(title: string, body: string, type: number, recipients: MessageRecipientInput[]): Observable<SendMessageResult> {
    const url = this.config.apiUrl + '/Messages/SendMessage';
    return this.http.post<SendMessageResult>(url, {
      Title: title,
      Body: body,
      Type: type,
      Recipients: recipients
    });
  }

  public respondToMessage(messageId: string, type: number, note: string): Observable<RespondToMessageResult> {
    const url = this.config.apiUrl + '/Messages/RespondToMessage';
    return this.http.put<RespondToMessageResult>(url, {
      Id: messageId,
      Type: type,
      Note: note
    });
  }

  public deleteMessage(messageId: string): Observable<DeleteMessageResult> {
    const url = this.config.apiUrl + '/Messages/DeleteMessage?messageId=' + messageId;
    return this.http.delete<DeleteMessageResult>(url);
  }

  public getRecipients(disallowNoone: boolean, includeUnits: boolean): Observable<GetRecipientsResult> {
    const url = this.config.apiUrl + '/Messages/GetRecipients?disallowNoone=' + disallowNoone + '&includeUnits=' + includeUnits;
    return this.http.get<GetRecipientsResult>(url);
  }
}
