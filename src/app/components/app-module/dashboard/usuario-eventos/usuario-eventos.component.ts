import { Component, OnInit, ViewChild, AfterViewInit, signal } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventService } from '../../../../services/event.service';
import { AuthService } from '../../../../services/auth.service';
import { Evento } from '../../../../models/evento';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FullCalendarModule } from '@fullcalendar/angular';
import moment from 'moment';

@Component({
  standalone: true,
  selector: 'app-usuario-eventos',
  templateUrl: './usuario-eventos.component.html',
  imports: [CardModule, CommonModule, TableModule, ButtonModule, FullCalendarModule],
  styleUrls: ['./usuario-eventos.component.scss'],
})
export class UsuarioEventosComponent implements OnInit, AfterViewInit {
  @ViewChild(FullCalendarComponent) fullCalendarComponent!: FullCalendarComponent;

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth',
    },
    initialView: 'dayGridMonth',
    events: [], // Se cargará dinámicamente
    editable: false,
    selectable: false,
    dayMaxEvents: true,
  });
  userId!: number;
  userEvents: Evento[] = []; // Array para almacenar los eventos del usuario

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.findUserIdByEmail().subscribe({
      next: (userId) => {
        this.userId = userId;
        this.loadUserEvents();
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario:', err);
      },
    });
  }

  formatTime(time: string): string {
    return moment(time, "HH:mm:ss").format("hh:mm A");
  }

  ngAfterViewInit(): void {
    // Asegurarnos de que la instancia de FullCalendar esté disponible después de la vista inicializada
    if (this.fullCalendarComponent) {
      const calendarApi = this.fullCalendarComponent.getApi();
    }
  }

  loadUserEvents(): void {
    this.eventService.findAllByUser(this.userId).subscribe({
      next: (events: Evento[]) => {
        this.userEvents = events; // Guardamos los eventos del usuario
        const transformedEvents = events.map((event) => ({
          id: event.id.toString(),
          title: event.nombre,
          start: event.fecha,
          end: event.fecha,
          description: event.descripcion,
        }));
        this.calendarOptions.update((options: any) => ({
          ...options,
          events: transformedEvents,
        }));
      },
      error: (err) => {
        console.error('Error al cargar eventos del usuario:', err);
      },
    });
  }

  goToEvent(event: Evento): void {
    const date = new Date(event.fecha);
    const calendarApi = this.fullCalendarComponent.getApi();  // Obtenemos la API del calendario
    calendarApi.gotoDate(date);  // Movemos el calendario a la fecha del evento
  }
}
