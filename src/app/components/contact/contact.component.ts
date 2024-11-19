import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit{

  contacts: Contact[] = [];

  constructor(
    private service: ContactService,
    private router: Router,
    private sharingData: SharingDataService
  ) {
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.contacts = this.router.getCurrentNavigation()?.extras.state!['contacts'];
    }
  }

  ngOnInit(): void {
      if (
        this.contacts == undefined ||
        this.contacts == null ||
        this.contacts.length == 0
      ) {
        this.service.findAll().subscribe((contacts) => (this.contacts = contacts));
      }
  }

  onRemoveContact(id:number): void {
    this.sharingData.idContactEventEmitter.emit(id);
  }

}
