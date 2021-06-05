export interface Empleado {
  id: string;
  nombre: string,
  apellido: string,
  documento: string,
  salario: number,
  fecha_creacion?: Date,
  fecha_actualizacion?: Date
}
