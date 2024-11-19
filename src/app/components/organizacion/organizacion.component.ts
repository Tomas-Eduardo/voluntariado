import { Component } from '@angular/core';
import { Organizacion } from '../../models/organizacion';
import { Router, RouterModule } from '@angular/router';
import { SharingDataService } from '../../services/sharing-data.service';
import { OrganizacionService } from '../../services/organizacion.service';

@Component({
  selector: 'app-organizacion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './organizacion.component.html'
})
export class OrganizacionComponent {

  orgs: Organizacion[] = [];

  constructor(
    private service: OrganizacionService,
    private router: Router,
    private sharingData: SharingDataService
  ) { 
    if (this.router.getCurrentNavigation()?.extras.state) {
      this.orgs = this.router.getCurrentNavigation()?.extras.state!['orgs'];
    }
  }

  ngOnInit(): void {
    if (
      this.orgs == undefined ||
      this.orgs == null ||
      this.orgs.length == 0
    ) {
      this.service.findAll().subscribe((orgs) => (this.orgs = orgs));
    }
  }

  onRemoveOrgs(id:number): void {
    this.sharingData.newOrgEventEmitter.emit(id);
  }

}
