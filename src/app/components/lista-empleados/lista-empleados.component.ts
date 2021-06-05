import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lista-empleados',
  templateUrl: './lista-empleados.component.html',
  styleUrls: ['./lista-empleados.component.scss']
})
export class ListaEmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];

  constructor(private _empleadoService: EmpleadoService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEmpleados();
  }

  getEmpleados(): void{
    this._empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((empleado: any) => {
          this.empleados.push({
            id: empleado.payload.doc.id,
            ...empleado.payload.doc.data()
          })
      })
    });
  }

  borrarEmpleado(id: string): void{
    this._empleadoService.eliminarEmpleado(id)
      .then(() => { this.toastr.error('El empleado fue borrado correctamente', 'Empleado borrado', {positionClass: 'toast-bottom-right'}); })
      .catch((err) => { err });
  }

}
