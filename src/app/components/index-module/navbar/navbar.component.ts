import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RegisterComponent } from '../register/register.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';
import { AuthComponent } from '../auth/auth.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RegisterComponent, AuthComponent, ContactFormComponent],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent implements OnInit {

  showOrg = false;
  showRegister = false;
  showLogin = false;
  showContactForm = false;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user; // Inicializa el estado del usuario al cargar el componente
  }

  handlerLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  isAuth() {
    return this.authService.isAuth();
  }

  isAdmin() {
    return this.authService.hasAdminRole();
  }

  isOrganizador() {
    return this.authService.hasOrganizadorRole();
  }

  isVolunteer(){
    return this.authService.hasVolunteerRole();
  }

  notAuth() {
    return !this.authService.isAuth();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  openOrg() {
    this.showOrg = true;
  }

  openRegister() {
    this.showRegister = true;
    this.showLogin = false;
  }

  openLogin() {
    this.showLogin = true;
    this.showRegister = false;
  }

  openContactForm() {
    this.showLogin = false;
    this.showRegister = false;
  }
}
