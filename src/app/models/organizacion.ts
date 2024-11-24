import { Evento } from "./evento";

export class Organizacion {
  id?: number;
  nombre?: string;
  tipo?: string;
  telefono?: string;
  email?: string;
  organizadores?: string[]; // Lista de nombres o IDs de los organizadores
  descripcion?: string;
  website?: string;
  direccion?: string;
  eventos?: Evento[]; // Lista de eventos asociados a la organización
}
