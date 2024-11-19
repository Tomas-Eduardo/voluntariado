import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../models/user';
import { SharingDataService } from '../../../services/sharing-data.service';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  user: User;

  errors: any = null;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router
  ) {
    this.user = new User();
  }

  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.onClose(); // Cierra el modal al presionar ESC
  }

  onSubmit() {
    if (!this.user.email || !this.user.password) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Email y contraseña son requeridos',
      });
      return;
    }

    this.authService.loginUser({ email: this.user.email, password: this.user.password }).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Login successful',
          life: 1000,
        });
        this.onClose();  // Cierra el modal en caso de éxito
      },
      error: (err) => {
        if (err.status === 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Unauthorized',
            detail: 'Invalid email or password',
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'An unexpected error occurred',
          });
        }
      }
    });
  }

  onClose() {
    this.close.emit();
  }
}
