import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavbarComponent } from './index-module/navbar/navbar.component';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { IndexComponent } from './index-module/index/index.component';
import { FooterComponent } from './index-module/footer/footer.component';
import { MessageService } from 'primeng/api';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { SharingDataService } from '../services/sharing-data.service';
import { ContactService } from '../services/contact.service';
import { Contact } from '../models/contact';
import { AuthService } from '../services/auth.service';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-voluntariados-app',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, IndexComponent, FooterComponent, ToastModule],
  templateUrl: './voluntariados-app.component.html',
  providers: [MessageService]
})
export class VoluntariadosAppComponent implements OnInit{
  users: User[] = [];
  contacts: Contact[] = [];

  constructor(
    private router: Router,
    private userService: UserService,
    private sharingData: SharingDataService,
    private contactService: ContactService,
  ){}

  ngOnInit(): void {
    this.addUser();
    this.addContact();
  }

  // Function to add or update a user
  addUser() {
    this.sharingData.newUserEventEmitter.subscribe((user) => {
      if (user.id > 0) {
        this.userService.update(user).subscribe({
          next: (userUpdated) => {
            this.users = this.users.map((u) =>
              u.id === userUpdated.id ? { ...userUpdated } : u
            );
            // Open the login form after updating
            this.router.navigate(['/home']); // Navigate to 'users' after updating
          },
          error: (err) => {
            if (err.status === 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }
          },
        });
      } else {
        this.userService.saveUser(user).subscribe({
          next: (userNew) => {
            this.users = [...this.users, { ...userNew }];
            // Navigate to 'users' after creating
            this.router.navigate(['/users']);
          },
          error: (err) => {
            if (err.status === 400) {
              this.sharingData.errorsUserFormEventEmitter.emit(err.error);
            }
          },
        });
      }
    });
  }

  // Function to add Contact
  addContact() {
    this.sharingData.newContactEventEmitter.subscribe((contact) => {
      if (contact.id > 0) {
        this.contactService.update(contact).subscribe({
          next: (contactUpdated) => {
            this.contacts = this.contacts.map((c) =>
              c.id === contactUpdated.id ? { ...contactUpdated } : c
            );
            // Open the login form after updating
            this.router.navigate(['/home']); // Navigate to 'home' after updating
          },
          error: (err) => {
            if (err.status === 400) {
              this.sharingData.errorsContactFormEventEmitter.emit(err.error);
            }
          },
        });
      } else {
        this.contactService.saveContact(contact).subscribe({
          next: (contactNew) => {
            this.contacts = [...this.contacts, { ...contactNew }];
            // Navigate to 'users' after creating
            this.router.navigate(['/home']);
          },
          error: (err) => {
            if (err.status === 400) {
              this.sharingData.errorsContactFormEventEmitter.emit(err.error);
            }
          },
        });
      }
    });
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }

}
