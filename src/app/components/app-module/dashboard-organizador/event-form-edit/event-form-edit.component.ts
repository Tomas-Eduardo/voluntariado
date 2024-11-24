import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '../../../../models/evento';
import { EventService } from '../../../../services/event.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import moment from 'moment';


@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    DropdownModule,
    CommonModule,
  ],
  templateUrl: './event-form-edit.component.html',
  styleUrls: ['./event-form-edit.component.scss'],
})
export class EventFormEdit implements OnInit {
  isSubmitted = false;
  eventId!: number;
  minDate: Date;

  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  eventForm = this.fb.group({
    nombre: ['', Validators.required],
    fecha: [null as Date | null, Validators.required],
    horario: ['', Validators.required],
    descripcion: ['', Validators.required],
    direccion: ['', Validators.required],
    ciudad: ['', Validators.required],
    estado: ['', Validators.required],
  });

  estados = [
    { name: 'Activo', code: 'Activo' },
    { name: 'Pendiente', code: 'Pendiente' },
  ];

  constructor() {
    this.minDate = new Date();
  }

  ngOnInit() {
    this.eventId = Number(this.route.snapshot.paramMap.get('id')); // Obtener el ID del evento desde la URL
    this.loadEvent(this.eventId); // Cargar los datos del evento
  }

  submitted(): boolean {
    return this.isSubmitted;
  }

  loadEvent(id: number) {
    this.eventService.findById(id).subscribe(
      (event: Evento) => {
        // Convierte el horario (HH:mm:ss) a un objeto moment válido
        const horario = event.horario; // Esto asume que el horario es una cadena en formato "HH:mm:ss"
        
        // Verifica si el formato es válido antes de pasar a moment
        const formattedHorario = moment(horario, 'HH:mm:ss', true).isValid() 
          ? moment(horario, 'HH:mm:ss').format('HH:mm') 
          : '';  // Si no es válido, lo dejamos vacío o lo manejas como prefieras
  
        // Verifica que el horario se haya formateado correctamente
        console.log('Horario formateado:', formattedHorario);
  
        // Actualiza el formulario con los valores correctos
        this.eventForm.patchValue({
          nombre: event.nombre,
          fecha: new Date(event.fecha), // Asegúrate de que 'fecha' sea un objeto Date válido
          horario: formattedHorario, // Asigna la hora formateada
          descripcion: event.descripcion,
          direccion: event.direccion,
          ciudad: event.ciudad,
          estado: event.estado,
        });
      },
      (error) => {
        console.error('Error al cargar el evento:', error);
      }
    );
  }
  

  onSubmit() {
    if (this.eventForm.invalid) return;
  
    const horario = this.eventForm.get('horario')?.value;
  
    // Asegúrate de que el horario esté en el formato HH:mm:ss
    const formattedHorario = moment(horario, 'HH:mm').isValid() 
      ? moment(horario, 'HH:mm').format('HH:mm:ss') 
      : '';  // Si no es válido, lo dejamos vacío o lo manejas como prefieras
  
    const updatedEvent: Evento = {
      id: this.eventId,
      voluntarios: [],
      nombre: this.eventForm.get('nombre')?.value || '',
      fecha: this.eventForm.get('fecha')?.value || new Date(),
      // Guardamos el horario formateado correctamente
      horario: formattedHorario,  // En formato "HH:mm:ss"
      descripcion: this.eventForm.get('descripcion')?.value || '',
      direccion: this.eventForm.get('direccion')?.value || '',
      ciudad: this.eventForm.get('ciudad')?.value || '',
      estado: this.eventForm.get('estado')?.value || '',
      organizacion: { id: 0, nombre: '' }, // Asume que no necesitas actualizar la organización
    };
  
    this.eventService.updateEv(updatedEvent).subscribe(
      (response: Evento) => {
        console.log('Evento actualizado:', response);
        this.router.navigate(['/organizador-dashboard']);
      },
      (error) => {
        console.error('Error al actualizar el evento:', error);
      }
    );
  }
  

  onCancel() {
    this.router.navigate(['/organizador-dashboard']);
  }
}
