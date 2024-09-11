export interface Client {
    id: number;
    nombre: string;
    apellidos: string;
    direccion: string | any;
    numero_documento: number;
    email: string | any;
    edad: number;
    telefono: number | any;
    fecha_nacimiento: string | any;
    pais: string | any;
    habilitado: boolean;
  }

export interface ClientFormData {
  nombre: string;
  apellidos: string;
  direccion: string | any;
  numero_documento: number | any;
  email: string;
  edad: number | any;
  telefono: number | any;
  fecha_nacimiento: string | any;
  pais: string | any;
}
