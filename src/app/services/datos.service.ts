import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  clave:any;
  cedula: any;
  keyInventario: any;
  constructor() { }

  //Métodos para obtener la clave del bar
    setClave(clv: any)
    {
      this.clave = clv;
    }
    getClave()
    {
      return this.clave;
    }
  //Métodos para obtener la clave del bar


  //Métodos para obtener la cédula del empleado
    setCedula(ced: any)
    {
      this.cedula = ced;
    }

    getCedula()
    {
      return this.cedula;
    }
  //Métodos para obtener la cédula del empleado

  //Métodos para obtener la clave del inventario
    setKey(key: any)
    {
      this.keyInventario = key;
    }
    getKey()
    {
      return this.keyInventario;
    }
  //Métodos para obtener la clave del inventario
}
