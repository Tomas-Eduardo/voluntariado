export class User {
    id!: number;
    nombre!: string;
    email!: string;
    password!: string;
    roles!: { id: number; name: string }[]; // Lista de roles del usuario
    fechaNacimiento!: Date;
  
    // Organización asociada (solo si es organizador)
    organization?: { 
      id: number; 
      nombre: string; 
      descripcion: string;
      email: string;
      telefono: string;
      direccion: string;
      website: string;
      tipo: string; 
    };
  
    // Eventos asociados (solo si es voluntario)
    eventos?: {
      id: number;
      nombre: string;
      descripcion: string;
      fechaInicio: Date;
      fechaFin: Date;
      organizacion: string; // Nombre de la organización organizadora
    }[];
  }
  