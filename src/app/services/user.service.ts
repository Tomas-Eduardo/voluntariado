import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private url: string = 'http://localhost:8080/api/users';
  private urlRole: string = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  findById(id: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }

  saveUser(user: User) {
    return this.http.post<User>(this.url, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${user.id}`, user);
  }

  updateUserOrg(id: number, userUpdate: { organizationId: number | null; roles: number[] }): Observable<User> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post<User>(
      `${this.url}/convert-to-organizer`,
      {
        userId: id,
        organizationId: userUpdate.organizationId,
        roles: userUpdate.roles,
      },
      { headers }
    );
  }
  
  
  
  

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  getRoles(): Observable<{ id: number; name: string }[]> {
    return this.http.get<{ id: number; name: string }[]>(`${this.urlRole}`);
  }
  
}
