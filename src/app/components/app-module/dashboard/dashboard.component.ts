import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { MatIconModule } from '@angular/material/icon';
import { SharingDataService } from '../../../services/sharing-data.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, AvatarModule, ScrollPanelModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userName: string = '';

  constructor(
  ) { }

  ngOnInit() {
    
  }

  events = [
    { name: 'Limpieza de Playa 1', location: 'Playa Local', time: '10:00 AM - 2:00 PM' },
    { name: 'Limpieza de Playa 2', location: 'Playa Local', time: '10:00 AM - 2:00 PM' },
    { name: 'Limpieza de Playa 3', location: 'Playa Local', time: '10:00 AM - 2:00 PM' },
    { name: 'Limpieza de Playa 4', location: 'Playa Local', time: '10:00 AM - 2:00 PM' },
    { name: 'Limpieza de Playa 5', location: 'Playa Local', time: '10:00 AM - 2:00 PM' },
  ];

  organizations = [
    { name: 'Organización 1', avatar: '/placeholder.svg?height=64&width=64', volunteers: 45, description: 'Trabajamos por el bienestar de la comunidad a través de proyectos sostenibles.' },
    { name: 'Organización 2', avatar: '/placeholder.svg?height=64&width=64', volunteers: 32, description: 'Trabajamos por el bienestar de la comunidad a través de proyectos sostenibles.' },
    { name: 'Organización 3', avatar: '/placeholder.svg?height=64&width=64', volunteers: 78, description: 'Trabajamos por el bienestar de la comunidad a través de proyectos sostenibles.' },
    { name: 'Organización 4', avatar: '/placeholder.svg?height=64&width=64', volunteers: 56, description: 'Trabajamos por el bienestar de la comunidad a través de proyectos sostenibles.' },
    { name: 'Organización 5', avatar: '/placeholder.svg?height=64&width=64', volunteers: 23, description: 'Trabajamos por el bienestar de la comunidad a través de proyectos sostenibles.' },
  ];




}
