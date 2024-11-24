import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../../models/evento';
import { EventService } from '../../../../services/event.service';
import { AuthService } from '../../../../services/auth.service';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import moment from 'moment';
import swal from 'sweetalert2';

@Component({
  standalone: true,
  selector: 'app-usuario-eventos',
  templateUrl: './usuario-eventos.component.html',
  imports: [CardModule, CommonModule, TableModule, ButtonModule],
  styleUrls: ['./usuario-eventos.component.scss'],
})
export class UsuarioEventosComponent implements OnInit {
  events: Evento[] = [];
  userId!: number;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.findUserIdByEmail().subscribe({
      next: (userId) => {
        this.userId = userId; // Guarda el ID del usuario logueado
        this.loadUserIdAndEvents();
      },
      error: (err) => {
        console.error('Error al obtener el ID del usuario logueado', err);
      },
    });
  }

  formatTime(time: string): string {
    return moment(time, 'HH:mm:ss').format('hh:mm A');
  }

  // Cargar el ID del usuario y los eventos
  loadUserIdAndEvents(): void {
    this.eventService.findAllByUser(this.userId).subscribe(
      (data: Evento[]) => {
        console.log('Eventos obtenidos:', data); // Agrega un log aquí
        this.events = data;
      },
      (error) => {
        console.error('Error al cargar eventos:', error);
      }
    );
  }

  // Cargar eventos del usuario
  loadUserEvents(): void {
    if (this.userId !== undefined) {
      this.eventService.findAllByUser(this.userId).subscribe(
        (data: Evento[]) => {
          console.log('Eventos obtenidos:', data); // Agrega un log aquí
          this.events = data;
        },
        (error) => {
          console.error('Error al cargar eventos:', error);
        }
      );
    }
  }

  // Ver detalles de un evento
  cancelarAsist(event: Evento): void {
    swal
      .fire({
        title: '¿Estás seguro?',
        text: '¡No podrás deshacer esta acción!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cancelar asistencia',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.eventService.deleteEvVol(event.id, this.userId).subscribe(
            () => {
              swal.fire('¡Cancelado!', 'Tu asistencia ha sido cancelada.', 'success');
              this.loadUserEvents();
            },
            (error) => {
              console.error('Error al cancelar asistencia:', error);
              swal.fire('¡Error!', 'No se pudo cancelar tu asistencia.', 'error');
            }
          );
        }
      });
  }
}
