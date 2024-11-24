import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [TableModule, ButtonModule, DropdownModule, DatePipe, CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  

  users: User[] = [];
  userData: any;

  roleMapping: { [key: string]: string } = {
    'ROLE_ADMIN': 'Administrador',
    'ROLE_USER': 'Voluntario',
    'ROLE_ORGANIZADOR': 'Organizador',
  };


  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.findAll().subscribe(users => {
      this.users = users;
    })
  }

  onUpdate(user: any) {
    // Lógica para actualizar el usuario
    console.log('Update user:', user);
  }

  onDelete(user: User) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar el usuario ${user.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.delete(user.id).subscribe(
          () => {
            // Filtra el usuario eliminado de la lista
            this.users = this.users.filter(u => u.id !== user.id);
            Swal.fire(
              'Eliminado!',
              'El usuario ha sido eliminado correctamente.',
              'success'
            );
          },
          (error) => {
            console.error('Error al eliminar el usuario:', error);
            Swal.fire(
              'Error',
              'Hubo un problema al eliminar el usuario.',
              'error'
            );
          }
        );
      }
    });
  }

  getUserRoles(user: any): string[] {
    if (user && user.roles) {
      return user.roles.map((role: any) => this.roleMapping[role.name] || role.name);
    }
    return [];
  }
  


}
