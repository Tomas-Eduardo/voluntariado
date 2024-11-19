import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { OrganizacionFormComponent } from '../organizacion-form/organizacion-form.component';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, RegisterComponent, OrganizacionFormComponent],
  templateUrl: './index.component.html',
})
export class IndexComponent {

  showOrganizacionForm = false;
  showRegister = false;

  features: Feature[] = [
    { icon: 'fas fa-heart text-red-500', title: 'Impacto Real', description: 'Marca la diferencia en tu comunidad' },
    { icon: 'fas fa-users text-blue-500', title: 'Comunidad', description: 'Únete a una red de voluntarios apasionados' },
    { icon: 'fas fa-calendar text-green-500', title: 'Flexibilidad', description: 'Encuentra oportunidades que se ajusten a tu horario' },
    { icon: 'fas fa-award text-yellow-500', title: 'Reconocimiento', description: 'Gana insignias y certificados por tu dedicación' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  
  ngOnInit() {
    if (this.authService.isAuth()) {

      // Redirige a /admin-dashboard si el usuario es admin
      if (this.authService.hasAdminRole()) {
        this.router.navigate(['/admin-dashboard']);
        return;
      } else {
        this.router.navigate(['/user-dashboard']);
      }
      
      
    }
  }

  openRegister() {
    this.showRegister = true;
  }

  openOrgRegister() {
    this.showOrganizacionForm = true;
  }

}
