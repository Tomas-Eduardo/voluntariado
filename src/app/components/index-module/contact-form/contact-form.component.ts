import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CardModule } from 'primeng/card';
import { Contact } from '../../../models/contact';
import { ActivatedRoute } from '@angular/router';
import { SharingDataService } from '../../../services/sharing-data.service';
import { ContactService } from '../../../services/contact.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    CardModule,
    ToastModule
  ],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
})
export class ContactFormComponent implements OnInit {
  contact: Contact;

  errors: any = null;

  ngOnInit(): void {
    this.sharingData.errorsContactFormEventEmitter.subscribe((errors) => {
      this.errors = errors;
    });
    console.log(this.errors);
    this.route.paramMap.subscribe((params) => {
      const id: number = +(params.get('id') || '0');
      if (id > 0) {
        this.contactService
          .findById(id)
          .subscribe((contact) => (this.contact = contact));
      }
    });
  }

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sharingData: SharingDataService,
    private contactService: ContactService
  ) {
    this.contact = new Contact();
  }

  onSubmit() {
    this.contactService.saveContact(this.contact).subscribe(
      (contact) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Registro enviado',
          detail: 'Gracias por contactarnos',
        });
        this.sharingData.newContactEventEmitter.emit(contact);
        this.onClose();
      },
      (error) => {
        if (error.status === 400) {
          this.errors = error.error;
          this.sharingData.errorsContactFormEventEmitter.emit(this.errors);
        }
        if (error.status === 500) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Ha ocurrido un error al enviar el registro',
          });
        }
      }
    );
  }

  onClose() {
    this.close.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.onClose(); // Llama al método para cerrar el modal
  }

  @Output() close = new EventEmitter<void>();
}
