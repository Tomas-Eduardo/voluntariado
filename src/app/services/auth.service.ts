import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { SharingDataService } from './sharing-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url: string = 'http://localhost:8080/login';

  private _token!: string | undefined;

  private _user: any = {
    isAuth: false,
    isAdmin: false,
    isOrganizador: false,
    email: undefined
  }

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  loginUser({ email, password }: any): Observable<any> {
    return this.http.post<any>(this.url, { email, password }).pipe(
      tap(user => {
        // Establecer el usuario como autenticado
        this.user = {
          isAuth: true,
          isAdmin: user.isAdmin || false,  // Si no se envía, predeterminar a false
          isOrganizador: user.isOrganizador || false, // Igualmente aquí
          email: user.email, // Asegúrate de que esto también esté disponible
        };
        this.token = user.token; // Si estás recibiendo un token
        console.log('Token:', this.token);
        // Redirigir al dashboard adecuado según el rol
        this.redirectUserBasedOnRole();
      })
    );
  }

  private redirectUserBasedOnRole() {
    if (this.hasAdminRole()) {
      this.router.navigate(['/admin-dashboard']);
    } else if (this.hasOrganizadorRole()) {
      this.router.navigate(['/organizador-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
  

  getEmail() {
    return this.user.email;
  }
  

  set user(user:any) {
    this._user = user;
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  get user() {
    if(this._user.isAuth) {
        return this._user;
    } else if(sessionStorage.getItem('user') != null) {
        this._user = JSON.parse(sessionStorage.getItem('user') || '{}');
        return this._user;
    }
    return this._user;
}


  set token(token: string) {
    this._token = token;
    sessionStorage.setItem('token', token)
  }

  get token() {
    if (this._token !== undefined) {
        return this._token;
    } else if (sessionStorage.getItem('token') !== null) {
        this._token = sessionStorage.getItem('token') || ''; // Esto podría dar un valor vacío si el token es null
        return this._token;
    }
    return this._token!;
}


  getPayload(token: string){
    if(token != null){
      return JSON.parse(atob(token.split(".")[1]));
    }
    return null;
  }

  isAdmin() {
    return this.user.isAdmin;
  }

  hasAdminRole(): boolean {
    const token = this.token;
    if (token) {
      const payload = this.getPayload(token);
      return payload && payload.isAdmin === true;  // Retorna true si es admin
    }
    return false;
  }

  hasOrganizadorRole(): boolean {
    const token = this.token;
    if (token) {
      const payload = this.getPayload(token);
      return payload && payload.isOrganizador === true;  // Retorna true si es organizador
    }
    return false
  }
  
  isOrganizador() {
    return this.user.isOrganizador;
  }

  isUsuario() {
    return this.user.isUsuario;
  }

  isAuth() {
    return this.user.isAuth;
}

  logout() {
    this._token = undefined;
    this._user = {
        isAuth: false,
        isAdmin: false,
        isOrganizador: false,
        email: undefined
    };
    sessionStorage.clear(); // Limpia todo el sessionStorage
  }

  // Metodo para verificar si esta logeado

  isLogged() {
    if (this.user.isAuth) {
        return true;
    } else {
        return false;
    }
  }

}
