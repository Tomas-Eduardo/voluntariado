import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { SharingDataService } from '../../services/sharing-data.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit{

  users: User[] = [];

  constructor(
    private service: UserService,
    private router: Router,
    private sharingData: SharingDataService
  ) { 
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.users = this.router.getCurrentNavigation()?.extras.state!['users'];
    }
  }

  ngOnInit(): void {
    if (
      this.users == undefined ||
      this.users == null ||
      this.users.length == 0
    ) {
      this.service.findAll().subscribe((users) => (this.users = users));
    }
  }

  onRemoveUser(id:number): void {
    this.sharingData.idUserEventEmitter.emit(id);
  }
}
