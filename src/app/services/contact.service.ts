import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private url: string = 'http://localhost:8080/api/contact';

  constructor(private http: HttpClient) { }

  findAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.url);
  }

  findById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.url}/${id}`);
  }

  saveContact(contact: Contact) {
    return this.http.post<Contact>(this.url, contact);
  }

  update(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.url}/${contact.id}`, contact);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
