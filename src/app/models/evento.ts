import { Organizacion } from "./organizacion";

export class Evento {
  id!: number;
  nombre!: string;
  fecha!: Date;
  horario!: string; // Agregado el campo horario
  descripcion!: string;
  ciudad!: string;
  direccion!: string; // Agregado el campo direccion
  estado!: string;
  voluntarios!: string[];
  organizacion!: Organizacion; // Cambiado de organizacionId a organizacion
  isUserRegistered?: boolean; // Agregar este campo
}
