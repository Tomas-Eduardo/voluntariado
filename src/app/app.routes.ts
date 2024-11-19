import { Routes } from '@angular/router';
import { IndexComponent } from './components/index-module/index/index.component';
import { Forbidden403Component } from './components/forbidden403/forbidden403.component';
import { DashboardComponent } from './components/app-module/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { DashboardAdminComponent } from './components/app-module/dashboard-admin/dashboard-admin.component';
import { DashboardOrganizadorComponent } from './components/app-module/dashboard-organizador/dashboard-organizador.component';

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
        path: 'admin-dashboard',
        component: DashboardAdminComponent,
        canActivate: [authGuard]
    },
    {
        path: 'organizador-dashboard',
        component: DashboardOrganizadorComponent,
        canActivate: [authGuard]
    }
];
