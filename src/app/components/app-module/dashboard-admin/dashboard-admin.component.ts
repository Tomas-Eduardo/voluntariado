import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';
import { OrganizacionService } from '../../../services/organizacion.service';
import { Organizacion } from '../../../models/organizacion';
import { Contact } from '../../../models/contact';
import { ContactService } from '../../../services/contact.service';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, TableModule, MatIconModule, ScrollPanelModule, DialogModule, RouterLink],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.scss']
})
export class DashboardAdminComponent implements OnInit {

  users: User[] = [];
  orgs: Organizacion[] = [];
  contacts: Contact[] = [];
  orgData: any;
  userData: any;
  displayMessage: boolean = false;
  selectedContact: Contact | null = null;

  constructor(
    private userService: UserService,
    private orgService: OrganizacionService,
    private contactService: ContactService
  ) { }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
      this.updateUserStatistics(users);

      // Imprimir roles de los usuarios
      console.log(users.map(user => user.roles.map(role => role.name)));
    });

    this.orgService.findAll().subscribe(orgs => {
      this.orgs = orgs;
      this.updateOrgStatistics(orgs);
      console.log('Organizaciones:', orgs);
    });

    this.contactService.findAll().subscribe(contacts => {
      this.contacts = contacts;
      console.log('Contactos:', contacts);
    });
  
  }
  
  showMessage(contact: Contact) {
    this.selectedContact = contact;
    this.displayMessage = true;
  }

  deleteContact(contact: Contact): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el mensaje de ${contact.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.contactService.delete(contact.id).subscribe(
          () => {
            // Filtra el contacto eliminado de la lista
            this.contacts = this.contacts.filter(c => c.id !== contact.id);
            Swal.fire(
              'Eliminado!',
              'El mensaje ha sido eliminado correctamente.',
              'success'
            );
          },
          (error) => {
            console.error('Error al eliminar el contacto:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el mensaje.',
              'error'
            );
          }
        );
      }
    });
  }
  
  
  
  updateUserStatistics(users: User[]): void {
    // Calcula el número de usuarios de cada rol (ejemplo)
    const volunteers = users.filter(user => user.roles.some(role => role.name === 'ROLE_USER')).length;
    const organizations = users.filter(user => user.roles.some(role => role.name === 'ROLE_ORGANIZADOR')).length;
    const admins = users.filter(user => user.roles.some(role => role.name === 'ROLE_ADMIN')).length;

    // Actualiza los datos del gráfico
    this.userData = {
      labels: ['Voluntarios', 'Organizaciones', 'Administradores'],
      datasets: [
        {
          data: [volunteers, organizations, admins],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }
      ]
    };
  }
  
  updateOrgStatistics(orgs: Organizacion[]): void {
    // Categoriza las organizaciones (ejemplo)
    const ong = orgs.filter(org => org.tipo === 'ONG').length;
    const fundaciones = orgs.filter(org => org.tipo === 'Fundación').length;
    const asociaciones = orgs.filter(org => org.tipo === 'Asociación').length;
    const otros = orgs.length - (ong + fundaciones + asociaciones);

    // Actualiza los datos del gráfico
    this.orgData = {
      labels: ['ONG', 'Fundaciones', 'Asociaciones', 'Otros'],
      datasets: [
        {
          label: 'Número de Organizaciones',
          backgroundColor: '#42A5F5',
          data: [ong, fundaciones, asociaciones, otros]
        }
      ]
    };
  }

  fetchUsers(): void {
    this.userService.findAll().subscribe(
      (data: User[]) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  fetchOrgs(): void {
    this.orgService.findAll().subscribe(
      (data: any) => {
        console.log('Organizaciones:', data);
      },
      (error) => {
        console.error('Error al obtener organizaciones:', error);
      }
    );
  }

  chartOptions = {
    responsive: true,
    scales: {
      y: {
        ticks: {
          beginAtZero: true, // Asegura que el gráfico comience desde cero
          callback: function (value: number) {
            return value % 1 === 0 ? value : ''; // Muestra solo enteros, omite decimales
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#495057',
        },
      },
    },
  };

}
