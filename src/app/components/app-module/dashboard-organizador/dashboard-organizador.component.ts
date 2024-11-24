import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { OrganizacionService } from '../../../services/organizacion.service';
import { EventService } from '../../../services/event.service';
import { Organizacion } from '../../../models/organizacion';
import { Evento } from '../../../models/evento';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-dashboard-organizador',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ChartModule,
    TableModule,
    TagModule,
    RouterLink,
  ],
  templateUrl: './dashboard-organizador.component.html',
  styleUrls: ['./dashboard-organizador.component.scss'],
})
export class DashboardOrganizadorComponent implements OnInit {
  organizacion!: Organizacion;
  eventParticipationData: any;
  upcomingEvents: Evento[] = [];
  chartOptions: any;

  constructor(
    private organizacionService: OrganizacionService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadOrganizationData();
    this.initializeChartOptions();
  }

  loadOrganizationData(): void {
    this.organizacionService.getUserOrganization().subscribe({
      next: (org) => {
        if (!org || !org.id) {
          console.error('Organización no encontrada o no válida:', org);
          return;
        }
        this.organizacion = { ...org, eventos: org.eventos || [] };
        console.log('Organización cargada:', this.organizacion);
        this.loadEventData();
      },
      error: (err) => {
        console.error('Error al cargar la organización:', err);
      },
    });
  }

  loadEventData(): void {
    this.eventService.findAll().subscribe({
      next: (events: Evento[]) => {
        console.log('Eventos cargados (raw):', events);

        // Formatear datos con AM/PM
        this.organizacion.eventos = events
          .map((event) => ({
            ...event,
            horarioFormateado: event.horario
              ? moment
                  .tz(`1970-01-01T${event.horario}`, 'America/Santiago')
                  .format('hh:mm A')
              : '00:00 AM', // Por defecto si no hay horario
          }))
          .filter((event) => event.organizacion?.id === this.organizacion.id);

        console.log(
          'Eventos filtrados y procesados:',
          this.organizacion.eventos
        );

        this.initializeDashboardData();
      },
      error: (err) => {
        console.error('Error al cargar los eventos:', err);
      },
    });
  }

  initializeChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      scales: {
        y: {
          ticks: {
            beginAtZero: true, // Asegura que el gráfico comience desde cero
            callback: function (value: number) {
              return value % 1 === 0 ? value : ''; // Muestra solo enteros, omite decimales
            },
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: '#495057',
          },
        },
      },
    };
  }

  initializeDashboardData(): void {
    if (!this.organizacion?.eventos || this.organizacion.eventos.length === 0) {
      console.log('No hay eventos disponibles');
      return;
    }
  
    console.log('Eventos de la organización:', this.organizacion.eventos);
  
    // Inicializa datos de participación
    this.eventParticipationData = {
      labels: this.organizacion.eventos.map(
        (event) => event.nombre || 'Evento sin nombre'
      ),
      datasets: [
        {
          label: 'Voluntarios',
          data: this.organizacion.eventos.map(
            (event) => event.voluntarios?.length || 0
          ),
          backgroundColor: '#42A5F5',
        },
      ],
    };
  
    // Formatear fechas en formato día/mes/año
    this.upcomingEvents = this.organizacion.eventos.map((event) => ({
      ...event,
      fechaFormateada: moment
        .tz(event.fecha, 'America/Santiago')
        .format('DD/MM/YYYY'),
      fecha: new Date(
        moment.tz(event.fecha, 'America/Santiago').format('YYYY-MM-DDTHH:mm:ss')
      ),
    }));
  
    console.log('Eventos de la organización (formateados):', this.upcomingEvents);
  }
  

  getEventStatusSeverity(
    estado: string
  ): 'success' | 'info' | 'warning' | 'danger' {
    switch (estado) {
      case 'Activo':
        return 'success';
      case 'Pendiente':
        return 'info';
      case 'Cancelado':
        return 'danger';
      default:
        return 'warning';
    }
  }

  onDelete(evento: Evento): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el evento ${evento.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(evento.id).subscribe({
          next: () => {
            console.log('Evento eliminado:', evento);

            // Actualiza la lista de eventos en el frontend
            this.organizacion.eventos = this.organizacion.eventos?.filter(
              (e) => e.id !== evento.id
            );
            this.initializeDashboardData(); // Actualiza gráficos y datos

            Swal.fire(
              'Eliminado!',
              'El evento ha sido eliminado correctamente.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error al eliminar el evento:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el evento.',
              'error'
            );
          },
        });
      }
    });
  }
}
