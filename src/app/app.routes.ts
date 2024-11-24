import { Routes } from '@angular/router';
import { IndexComponent } from './components/index-module/index/index.component';
import { Forbidden403Component } from './components/forbidden403/forbidden403.component';
import { DashboardComponent } from './components/app-module/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { DashboardAdminComponent } from './components/app-module/dashboard-admin/dashboard-admin.component';
import { DashboardOrganizadorComponent } from './components/app-module/dashboard-organizador/dashboard-organizador.component';
import { UserListComponent } from './components/app-module/dashboard-admin/user-list/user-list.component';
import { UserEditComponent } from './components/app-module/dashboard-admin/user-edit/user-edit.component';
import { EventFormComponent } from './components/app-module/dashboard-organizador/event-form/event-form.component';
import { EventFormEdit } from './components/app-module/dashboard-organizador/event-form-edit/event-form-edit.component';
import { UsuarioEventosComponent } from './components/app-module/dashboard/usuario-eventos/usuario-eventos.component';
import { OrganizacionesListComponent } from './components/app-module/dashboard-admin/organizaciones-list/organizaciones-list.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home' // Cambiado a 'home'
    },
    {
        path: 'home',
        component: IndexComponent
    },
    {
        path: 'forbidden',
        component: Forbidden403Component    
    },
    {
        path: 'user-dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
    },
    {
        path: "user-dashboard/usuario-eventos",
        component: UsuarioEventosComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin-dashboard',
        component: DashboardAdminComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin-dashboard/org-list',
        component: OrganizacionesListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'organizador-dashboard',
        component: DashboardOrganizadorComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin-dashboard/user-list',
        component: UserListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'admin-dashboard/user-edit/:id',
        component: UserEditComponent,
        canActivate: [authGuard]
    },
    {
        path: 'organizador-dashboard/event-create',
        component: EventFormComponent,
        canActivate: [authGuard]
    },
    {
        path: 'organizador-dashboard/event-edit/:id',
        component: EventFormEdit,
        canActivate: [authGuard]
    }
];
