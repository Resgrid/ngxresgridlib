import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { NotesResult } from '../../models/v4/notes/notesResult';
import { NoteResult } from '../../models/v4/notes/noteResult';


@Injectable({
  providedIn: 'root',
})
export class NotesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllNotes(): Observable<NotesResult> {
    const url = this.config.apiUrl + '/Notes/GetAllNotes';
    return this.http.get<NotesResult>(url);
  }

  public getDispatchNote(): Observable<NoteResult> {
    const url = this.config.apiUrl + '/Notes/GetDispatchNote';
    return this.http.get<NoteResult>(url);
  }
}
