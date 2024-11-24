import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { VoluntariadosAppComponent } from './components/voluntariados-app.component';
import { RegisterComponent } from './components/index-module/register/register.component';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { CalendarUtils } from 'angular-calendar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, VoluntariadosAppComponent, RegisterComponent, ToastModule, CalendarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'voluntariadoFront';
  
}
