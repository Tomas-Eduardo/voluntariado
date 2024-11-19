import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  HostListener,
  OnInit,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { SharingDataService } from '../../../services/sharing-data.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule, ToastModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  user: User;

  errors: any = null;

  ngOnInit(): void {
    this.sharingData.errorsUserFormEventEmitter.subscribe((errors) => {
      this.errors = errors;
    });
    console.log(this.errors);
    this.route.paramMap.subscribe((params) => {
      const id: number = +(params.get('id') || '0');
      if (id > 0) {
        this.userService.findById(id).subscribe((user) => (this.user = user));
      }
    });
  }

  constructor(
    private messageService: MessageService,
    private route: ActivatedRoute,
    private sharingData: SharingDataService,
    private userService: UserService
  ) {
    this.user = new User();
  }

  onSubmit(): void {
    this.userService.saveUser(this.user).subscribe(
      (user) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'El usuario ha sido creado correctamente.',
        });
        this.sharingData.newUserEventEmitter.emit(user);
        this.onClose();
      },
      (error) => {
        if (error.status === 400) {
          this.errors = error.error;
          this.sharingData.errorsUserFormEventEmitter.emit(this.errors);
        }
        if (error.status === 403) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'El correo ya se encuentra registrado. Por favor, intente con otro correo.',
          });

        }
        // this.errors = error.error;
        // this.sharingData.errorsUserFormEventEmitter.emit(this.errors);
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
