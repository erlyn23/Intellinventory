import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  clave:any;
  cedula: any;
  keyInventario: any;
  Codigo: any;
  estado:any;
  operacion: any;
  proveedor: any;
  sucursal: any;
  sendNot: any;
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

  //Métodos para obtener el código del producto
    setCode(key: any)
    {
      this.Codigo = key;
    }
    getCode()
    {
      return this.Codigo;
    }
  //Métodos para obtener el código del producto
  
  //Métodos para obtener el estado del inventario
    setEstado(state: any)
    {
      this.estado = state;
    }
    getEstado()
    {
      return this.estado;
    }
  //Métodos para obtener el estado del inventario

  //Métodos para obtener el tipo de operación del proveedor
    setOperacion(op: any)
    {
      this.operacion = op;
    }
    getOperacion()
    {
      return this.operacion;
    }
  //Métodos para obtener el tipo de operación del proveedor

  //Métodos para obtener el proveedor
    setProveedor(prov: any)
    {
      this.proveedor = prov;
    }
    getProveedor()
    {
      return this.proveedor;
    }
  //Métodos para obtener el proveedor

  //Métodos para obtener la sucursal
    setSucursal(sucursal: any)
    {
      this.sucursal = sucursal;
    }
    getSucursal()
    {
      return this.sucursal;
    }
  //Métodos para obtener la sucursal
}
