import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Organizacion } from '../../../models/organizacion';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SharingDataService } from '../../../services/sharing-data.service';
import { OrganizacionService } from '../../../services/organizacion.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-organizacion-form',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, ToastModule],
  templateUrl: './organizacion-form.component.html'
})
export class OrganizacionFormComponent {


  org: Organizacion;

  errors: any = null;

  ngOnInit(): void {
    this.sharingData.errorsOrgEventEmitter.subscribe((errors) => {
      this.errors = errors;
    });
    console.log(this.errors);
    this.route.paramMap.subscribe((params) => {
      const id: number = +(params.get('id') || '0');
      if (id > 0) {
        this.orgService.findById(id).subscribe((org) => (this.org = org));
      }
    });
  }

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sharingData: SharingDataService,
    private orgService: OrganizacionService
  ) {
    this.org = new Organizacion();
  }

  onSubmit(): void {
    this.orgService.saveOrg(this.org).subscribe(
      (org) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'La organización ha sido registrada correctamente.',
        });
        this.sharingData.newOrgEventEmitter.emit(org);
        this.onClose();
      },
      (error) => {
        if (error.status === 400) {
          this.errors = error.error;
          this.sharingData.errorsOrgEventEmitter.emit(this.errors);
        }
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El correo ya se encuentra registrado. Por favor, intente con otro correo.',
          });

        }
      }
    );
  }

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.onClose(); // Llama al método para cerrar el modal
  }

  // mindate and maxdate
  minDate = new Date('01/01/1900');
  maxDate = new Date('12/31/2006');

  onClose() {
    this.close.emit();
  }

}
