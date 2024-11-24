import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { Organizacion } from '../../../../models/organizacion';
import { OrganizacionService } from '../../../../services/organizacion.service';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-organizaciones-list',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    DropdownModule,
    ChartModule,
    CardModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './organizaciones-list.component.html',
  styleUrl: './organizaciones-list.component.scss',
})
export class OrganizacionesListComponent implements OnInit {
  orgs: Organizacion[] = [];
  orgData: any;

  constructor(private orgService: OrganizacionService) {}

  ngOnInit(): void {
    this.orgService.findAll().subscribe((orgs) => {
      this.orgs = orgs;
    });
    this.orgService.findAll().subscribe((orgs) => {
      this.orgs = orgs;
      this.updateOrgStatistics(orgs);
      console.log('Organizaciones:', orgs);
    });
  }

  updateOrgStatistics(orgs: Organizacion[]): void {
    // Categoriza las organizaciones (ejemplo)
    const ong = orgs.filter((org) => org.tipo === 'ONG').length;
    const fundaciones = orgs.filter((org) => org.tipo === 'Fundación').length;
    const asociaciones = orgs.filter((org) => org.tipo === 'Asociación').length;
    const otros = orgs.length - (ong + fundaciones + asociaciones);

    // Actualiza los datos del gráfico
    this.orgData = {
      labels: ['ONG', 'Fundaciones', 'Asociaciones', 'Otros'],
      datasets: [
        {
          label: 'Número de Organizaciones',
          backgroundColor: '#42A5F5',
          data: [ong, fundaciones, asociaciones, otros],
        },
      ],
    };
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
