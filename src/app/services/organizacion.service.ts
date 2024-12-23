import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Organizacion } from '../models/organizacion';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OrganizacionService {
  private url: string = 'http://localhost:8080/api/organization';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Organizacion[]> {
    return this.http.get<Organizacion[]>('http://localhost:8080/api/organization');
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

  private handleError(error: HttpErrorResponse) {
    console.error('Error al cargar organizaciones:', error);
    return throwError(() => new Error('Error al cargar organizaciones'));
  }

  getUserOrganization(): Observable<Organizacion> {
    return this.http.get<Organizacion>(`${this.url}/user`).pipe(catchError(this.handleError));
  }
  
}
