export class User {

    id!: number;
    nombre!: string;
    email!: string;
    password!: string;
    roles!: { id: number; name: string }[]; // Ajuste para roles
    fechaNacimiento!: Date;
}