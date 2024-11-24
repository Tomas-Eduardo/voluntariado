import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import Swal from 'sweetalert2';
import { EventService } from '../../../services/event.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import { Evento } from '../../../models/evento';
import { Organizacion } from '../../../models/organizacion';
import { AuthService } from '../../../services/auth.service';
import moment from 'moment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, BadgeModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  events: Evento[] = [];
  organizations: Organizacion[] = [];
  userId!: number;

  constructor(
    private eventService: EventService,
    private organizacionService: OrganizacionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Obtener el ID del usuario logueado
    this.authService.findUserIdByEmail().subscribe({
      next: (userId) => {
        this.userId = userId; // Guarda el ID del usuario logueado
        this.loadAvailableEvents(); // Cargar eventos una vez obtenido el ID
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario logueado', err);
      },
    });
  
    this.loadOrganizations();
  }

  formatTime(time: string): string {
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }
  

  // Método para cargar los eventos disponibles para el usuario
  loadAvailableEvents() {
    this.eventService.getAvailableEvents(this.userId).subscribe({
      next: (events) => {
        console.log('Eventos disponibles:', events);
        this.events = events; // Guarda los eventos disponibles
      },
      error: (err) => {
        console.error('Error al obtener los eventos disponibles', err);
      },
    });
  }
  

  // Método para cargar las organizaciones
  loadOrganizations() {
    this.organizacionService.findAll().subscribe({
      next: (data) => (this.organizations = data),
      error: (err) => console.error('Error al cargar organizaciones', err),
    });
  }

  // Verificar si el usuario está inscrito en el evento
  isUserRegisteredForEvent(eventId: number): boolean {
    return this.events.some(
      (event) => event.id === eventId && event.isUserRegistered
    );
  }

  // Método para inscribirse a un evento
  inscribirse(eventId: number) {
    const volunteerId = this.userId; // ID del usuario logueado
    this.eventService.registerVolunteer(eventId, volunteerId).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Inscripción exitosa!',
          text: 'Te has inscrito al evento exitosamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        });
        this.loadAvailableEvents(); // Recargar los eventos disponibles
      },
      error: (err) => {
        console.error('Error al inscribirse en el evento', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo completar la inscripción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
  
}
