import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Organizacion } from '../models/organizacion';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionService {

  private url: string = 'http://localhost:8080/api/organization';

  constructor(
    private http: HttpClient
  ) { }


  findAll(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>(this.url);
  }

  findById(id: number): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.url}/${id}`);
  }

  saveOrg(org: Organizacion): Observable<Organizacion> {
    return this.http.post<Organizacion>(this.url, org);
  }

  updateOrg(org: Organizacion): Observable<Organizacion> {
    return this.http.put<Organizacion>(this.url, org);
  }

  deleteOrg(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

}
