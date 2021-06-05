import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from '../../services/empleado.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-crear-empleado',
  templateUrl: './crear-empleado.component.html',
  styleUrls: ['./crear-empleado.component.scss']
})
export class CrearEmpleadoComponent implements OnInit {

  form_empleado: FormGroup;
  guardado: boolean = false;
  loading: boolean = false;
  id: string | null = null;
  titulo: string = 'Agregar empleado'

  constructor(private fb: FormBuilder, private _empleadoService: EmpleadoService, private router: Router, private toastr: ToastrService, private aRoute: ActivatedRoute) {
    this.form_empleado = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      documento: ['', Validators.required],
      salario: ['', Validators.required]
    })
    this.id = this.aRoute.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit(): void {
    this.esIdEmpleado();
  }

  agregarOeditar(){
    this.guardado = true;
    if(this.form_empleado.invalid){
      return;
    }
    if(this.id === null){
      this.agregarEmpleado();
    }else{
      this.editarEmpleado(this.id);
    }
  }

  agregarEmpleado(){
    const empleado: any = {
      nombre: this.form_empleado.value.nombre,
      apellido: this.form_empleado.value.apellido,
      documento: this.form_empleado.value.documento,
      salario: this.form_empleado.value.salario,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.añadirEmpleado(empleado).then(() => {
      this.toastr.success('El empleado fue registrado correctamente', 'Empleado guardado', {positionClass: 'toast-bottom-right'});
      this.loading = false;
      this.router.navigate(['/lista-empleados']);
    }).catch(error => {
        error
        this.loading = false;
    });
  }

  editarEmpleado(id: string){
    const empleado: any = {
      nombre: this.form_empleado.value.nombre,
      apellido: this.form_empleado.value.apellido,
      documento: this.form_empleado.value.documento,
      salario: this.form_empleado.value.salario,
      fecha_actualizacion: new Date()
    }
    this.loading = true;
    this._empleadoService.editarEmpleado(id, empleado)
      .then(() => {
        this.loading = false;
        this.toastr.info('El empleado fue modificado correctamente', 'Empleado modificado', {positionClass: 'toast-bottom-right'});
        this.router.navigate(['/lista-empleados']);
      })
      .catch(error => {
        error
        this.loading = false;
      });
  }

  esIdEmpleado(){
    if(this.id != null){
      this.titulo = 'Editar empleado';
      this.loading = true;
      this._empleadoService.getEmpleado(this.id).subscribe(data => {
        this.loading = false;
        this.form_empleado.setValue({
          nombre: data.payload.data()['nombre'],
          apellido: data.payload.data()['apellido'],
          documento: data.payload.data()['documento'],
          salario: data.payload.data()['salario'],
        })
      });
    }
  }

}
