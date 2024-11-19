import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-dashboard-organizador',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, ChartModule, TableModule, ProgressBarModule, TagModule, MatIconModule, TooltipModule],
  templateUrl: './dashboard-organizador.component.html',
  styleUrl: './dashboard-organizador.component.scss'
})
export class DashboardOrganizadorComponent {

  @NgModule({

    declarations: [
  
      DashboardOrganizadorComponent
  
    ],
  
    imports: [
  
      CommonModule,
  
      ChartModule,
  
      TableModule,
  
      ProgressBarModule,
  
      TagModule,
  
      MatIconModule,
  
      TooltipModule
  
    ]
  
  })

  eventParticipationData = {
    labels: ['Limpieza de Playa', 'Reforestación', 'Campaña de Reciclaje', 'Ayuda Comunitaria', 'Educación Ambiental'],
    datasets: [
      {
        label: 'Voluntarios Registrados',
        backgroundColor: '#42A5F5',
        data: [65, 59, 80, 81, 56]
      }
    ]
  };

  volunteerDistributionData = {
    labels: ['18-25 años', '26-35 años', '36-45 años', '46-55 años', '56+ años'],
    datasets: [
      {
        data: [30, 50, 20, 15, 12],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
      }
    ]
  };

  chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  upcomingEvents = [
    { name: 'Limpieza de Playa', date: '2023-06-15', registrationProgress: 75, registeredVolunteers: 30, totalSpots: 40, status: 'Abierto' },
    { name: 'Reforestación', date: '2023-06-22', registrationProgress: 50, registeredVolunteers: 20, totalSpots: 40, status: 'Abierto' },
    { name: 'Campaña de Reciclaje', date: '2023-06-29', registrationProgress: 100, registeredVolunteers: 25, totalSpots: 25, status: 'Completo' },
    { name: 'Ayuda Comunitaria', date: '2023-07-05', registrationProgress: 25, registeredVolunteers: 10, totalSpots: 40, status: 'Abierto' },
    { name: 'Educación Ambiental', date: '2023-07-12', registrationProgress: 0, registeredVolunteers: 0, totalSpots: 30, status: 'Próximo' }
  ];

  topVolunteers = [
    { name: 'Ana García', eventsParticipated: 12, hoursDonated: 48},
    { name: 'Carlos Rodríguez', eventsParticipated: 10, hoursDonated: 40},
    { name: 'María López', eventsParticipated: 8, hoursDonated: 32},
    { name: 'Juan Martínez', eventsParticipated: 7, hoursDonated: 28},
    { name: 'Laura Sánchez', eventsParticipated: 6, hoursDonated: 24 }
  ];

  getEventStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {

    switch (status) {
  
      case 'Completed':
  
        return 'success';
  
      case 'In Progress':
  
        return 'info';
  
      case 'Pending':
  
        return 'warning';
  
      case 'Cancelled':
  
        return 'danger';
  
      default:
  
        return 'secondary';
  
    }
  
  }
}
