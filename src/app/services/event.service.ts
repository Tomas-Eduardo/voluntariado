import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Evento } from '../models/evento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private url: string = 'http://localhost:8080/api/events';

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Obtener todos los eventos
  findAll(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(catchError(this.handleError));
  }

  // Obtener eventos activos
  findAllActive(): Observable<any[]> {
    return this.http.get<any[]>(this.url + '/active').pipe(catchError(this.handleError));
  }

  findAllByUser(userId: number): Observable<Evento[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
    return this.http.get<Evento[]>(`${this.url}/registered/${userId}`, { headers }).pipe(
      catchError(this.handleError)
    );
}

  // Registrar un voluntario para un evento
  registerVolunteer(eventId: number, userId: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
    return this.http.post<any>(`${this.url}/${eventId}/volunteers/${userId}`, {}, { headers });
  }

  // Obtener evento por ID
  findById(id: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.url}/${id}`);
  }

  // Guardar un evento
  saveEv(ev: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.url, ev);
  }

  // Actualizar un evento
  updateEv(ev: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.url}/${ev.id}`, ev);
  }

  // Eliminar un voluntario de un evento
  deleteEvVol(eventId: number, volunteerId: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
    return this.http.delete<void>(`${this.url}/${eventId}/volunteers/${volunteerId}`, { headers });
  }

  // Obtener eventos disponibles para un usuario
  getAvailableEvents(userId: number): Observable<Evento[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
    return this.http.get<Evento[]>(`${this.url}/available/${userId}`, { headers });
  }

  // Eliminar un voluntario de un evento
  deleteVolunteerFromEvent(eventId: number, volunteerId: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
    return this.http.delete<void>(`${this.url}/${eventId}/volunteers/${volunteerId}`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar un evento
  deleteEvent(id: number): Observable<void> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.token}`);
    return this.http.delete<void>(`${this.url}/${id}`, { headers });
  }

  // Manejar errores
  private handleError(error: HttpErrorResponse) {
    console.error('Error al cargar eventos:', error.message);  // Log the error message
    return throwError(() => new Error(`Error al cargar eventos: ${error.message}`));
  }
}
