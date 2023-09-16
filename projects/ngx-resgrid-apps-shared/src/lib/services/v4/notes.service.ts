import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { NotesResult } from '../../models/v4/notes/notesResult';
import { NoteResult } from '../../models/v4/notes/noteResult';
import { NoteCategoryResult } from '../../models/v4/notes/noteCategoryResult';
import { SaveNoteResult } from '../../models/v4/notes/saveNoteResult';


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

  public getAllUnexpiredNotesByCategory(category: string, includeUnCategorized: boolean): Observable<NotesResult> {
    const url = this.config.apiUrl + `/Notes/GetAllUnexpiredNotesByCategory?category=${category}&includeUnCategorized=${includeUnCategorized}`;
    return this.http.get<NotesResult>(url);
  }

  public getNote(noteId: string): Observable<NoteResult> {
    const url = this.config.apiUrl + '/Notes/GetNote?noteId=' + noteId;
    return this.http.get<NoteResult>(url);
  }

  public getNoteCategories(): Observable<NoteCategoryResult> {
    const url = this.config.apiUrl + '/Notes/GetNoteCategories';
    return this.http.get<NoteCategoryResult>(url);
  }

  public saveNote(title: string, body: string, category: string, isAdminOnly: boolean, expiresOn: string): Observable<SaveNoteResult> {
    const url = this.config.apiUrl + '/Notes/SaveNote';
    return this.http.post<SaveNoteResult>(url, {
      Title: title,
      Body: body,
      Category: category,
      IsAdminOnly: isAdminOnly,
      ExpiresOn: expiresOn
    });
  }
}
