import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { OrganizacionService } from '../../../../services/organizacion.service';
import { EventService } from '../../../../services/event.service';
import { Organizacion } from '../../../../models/organizacion';
import { Evento } from '../../../../models/evento';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, CalendarModule, InputTextModule, DropdownModule, CommonModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  isSubmitted = false; // Para saber si el formulario fue enviado
  organizacion: Organizacion | null = null;
  minDate: Date;

  private fb = inject(FormBuilder);

  constructor(
    private orgService: OrganizacionService,
    private eventService: EventService,
    private route: Router
  ) {
    this.minDate = new Date(); // Fecha mínima para el calendario
  }

  eventForm = this.fb.group({
    nombre: ['', Validators.required],
    fecha: [null as Date | null, Validators.required],
    horario: ['', Validators.required], // Agregado el campo horario
    descripcion: ['', Validators.required],
    direccion: ['', Validators.required],  // Agregado el campo direccion
    ciudad: ['', Validators.required],
    estado: ['', Validators.required]
  });

  estados = [
    { name: 'Activo', code: 'Activo' },
    { name: 'Pendiente', code: 'Pendiente' }
  ];

  ngOnInit() {
    this.orgService.getUserOrganization().subscribe(
      (org: Organizacion) => {
        this.organizacion = org; // Guardamos la organización en la variable
      },
      error => {
        console.error('Error al obtener la organización del usuario', error);
      }
    );
  }

  // Método para verificar si el formulario fue enviado
  submitted(): boolean {
    return this.isSubmitted;
  }

  // Ajustar la fecha para compensar la diferencia de zona horaria
  adjustDate(date: string): Date {
    const adjustedDate = new Date(date);
    adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());
    return adjustedDate;
  }

  onSubmit() {
    if (this.eventForm.invalid || !this.organizacion) {
        return;
    }

    const horario = this.eventForm.get('horario')?.value;
    const evento: Evento = {
        id: 0,
        voluntarios: [],
        nombre: this.eventForm.get('nombre')?.value || '',
        fecha: this.eventForm.get('fecha')?.value || new Date(),
        horario: horario ? new Date(horario).toTimeString().split(' ')[0] : '', // Formato HH:mm:ss
        descripcion: this.eventForm.get('descripcion')?.value || '',
        direccion: this.eventForm.get('direccion')?.value || '',
        ciudad: this.eventForm.get('ciudad')?.value || '',
        estado: this.eventForm.get('estado')?.value || '',
        organizacion: this.organizacion,
    };

    this.eventService.saveEv(evento).subscribe(
        (response: Evento) => {
            console.log('Evento creado:', response);
            this.eventForm.reset();
            this.isSubmitted = false;
            this.route.navigate(['/organizador-dashboard']);
        },
        error => {
            console.error('Error al crear el evento:', error);
        }
    );
}


  onCancel() {
    this.eventForm.reset();
    this.isSubmitted = false; // Resetear el estado de envío cuando se cancele
    this.route.navigate(['/organizador-dashboard']);
  }
}
