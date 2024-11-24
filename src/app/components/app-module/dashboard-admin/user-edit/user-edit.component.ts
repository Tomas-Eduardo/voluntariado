import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../models/user';
import { UserService } from '../../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { OrganizacionService } from '../../../../services/organizacion.service';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  standalone: true,
  imports: [CommonModule, DropdownModule, ReactiveFormsModule, ButtonModule, MultiSelectModule],
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
})
export class UserEditComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  organizations: SelectItem[] = [];
  roles: SelectItem[] = [];
  userId!: number; // ID del usuario a editar

  // Mapeo de nombres de roles a etiquetas personalizadas
  roleMapping: { [key: string]: string } = {
    ADMIN: 'Administrador',
    USER: 'Usuario',
    ORGANIZADOR: 'Organizador'
  };

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private organizacionService: OrganizacionService
  ) {
    this.userForm = this.fb.group({
      organization: [null],
      roles: [[], Validators.required],
    });
  }

  ngOnInit() {
    // Obtener el userId de la ruta activa
    this.route.paramMap.subscribe(params => {
      this.userId = Number(params.get('id'));
      if (this.userId) {
        this.loadUserData();
      }
    });

    // Cargar organizaciones
    this.loadOrganizations();

    // Cargar roles
    this.loadRoles();
  }

  loadUserData(): void {
    this.userService.findById(this.userId).subscribe((user: User) => {
      // Establecer valores iniciales en el formulario
      this.userForm.patchValue({
        organization: user.organization?.id || null,
        roles: user.roles.map((role) => role.id),
      });
    });
  }

  loadOrganizations(): void {
    this.organizacionService.findAll().subscribe((organizations) => {
      this.organizations = organizations.map((org) => ({
        label: org.nombre,
        value: org.id,
      }));
    });
  }

  loadRoles(): void {
    this.userService.getRoles().subscribe(
      (roles) => {
        this.roles = roles.map((role: { id: number; name: string }) => {
          // Remover prefijo "ROLE_" antes de mapear
          const roleKey = role.name.replace('ROLE_', '');
          return {
            label: this.roleMapping[roleKey] || roleKey, // Etiqueta amigable
            value: role.id, // ID como valor
          };
        });
        console.log(this.roles); // Para depuración
      },
      (error) => {
        console.error('Error al cargar los roles:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
  
      // Preparar datos para enviar
      const formValue = this.userForm.value;
      const userUpdate = {
        organizationId: formValue.organization || null, // Enviar null si no hay organización seleccionada
        roles: formValue.roles, // Lista de IDs de roles seleccionados
      };
  
      console.log('Datos enviados al backend:', userUpdate);
  
      this.userService.updateUserOrg(this.userId, userUpdate).subscribe(
        (response) => {
          console.log('Usuario actualizado:', response);
          // Procesa el nuevo formato del DTO si es necesario
          this.router.navigate(['/admin-dashboard']);
        },
        (error) => {
          console.error('Error al actualizar el usuario:', error);
          this.loading = false;
        }
      );      
    }
  }
  
  
  
  

  onCancel(): void {
    this.router.navigate(['/admin-dashboard/user-list']);
  }
}