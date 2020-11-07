import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { Provider } from '../shared/models/Provider';

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  barKey:string;
  employeeCode: string;
  inventoryKey: string;
  productCode: string;
  inventoryState:string;
  providerOperation: string;
  provider: string;
  subsidiary: string;
  constructor() { }

  //Métodos para obtener la clave del bar
    setBarKey(barKey: string)
    {
      this.barKey = barKey;
    }
    getBarKey()
    {
      return this.barKey;
    }
  //Métodos para obtener la clave del bar


  //Métodos para obtener la cédula del empleado
    setEmployeeCode(employeeCode: string)
    {
      this.employeeCode = employeeCode;
    }

    getEmployeeCode()
    {
      return this.employeeCode;
    }
  //Métodos para obtener la cédula del empleado

  //Métodos para obtener la clave del inventario
    setInventoryKey(inventoryKey: any)
    {
      this.inventoryKey = inventoryKey;
    }
    getInventoryKey()
    {
      return this.inventoryKey;
    }
  //Métodos para obtener la clave del inventario

  //Métodos para obtener el código del producto
    setProductCode(productCode: any)
    {
      this.productCode = productCode;
    }
    getProductCode()
    {
      return this.productCode;
    }
  //Métodos para obtener el código del producto
  
  //Métodos para obtener el estado del inventario
    setInventoryState(inventoryState: any)
    {
      this.inventoryState = inventoryState;
    }
    getInventoryState()
    {
      return this.inventoryState;
    }
  //Métodos para obtener el estado del inventario

  //Métodos para obtener el tipo de operación del proveedor
    setProviderOperation(providerOperation: any)
    {
      this.providerOperation = providerOperation;
    }
    getProviderOperation()
    {
      return this.providerOperation;
    }
  //Métodos para obtener el tipo de operación del proveedor

  //Métodos para obtener el proveedor
    setProvider(provider: string)
    {
      this.provider = provider;
    }
    getProveedor()
    {
      return this.provider;
    }
  //Métodos para obtener el proveedor

  //Métodos para obtener la sucursal
    setSubsidiary(subsidiary: string)
    {
      this.subsidiary = subsidiary;
    }
    getSubsidiary()
    {
      return this.subsidiary;
    }
  //Métodos para obtener la sucursal

  //Métodos para obtener datos necesarios
    employeeName: string;
    inventoryName: string;
    productName: string;
    subsidiaryName: string;

    setEmployeeName(employeeName:string)
    {
      this.employeeName = employeeName;
    }

    setInventoryName(inventoryName:any)
    {
      this.inventoryName = inventoryName;
    }

    setProductName(productName:string)
    {
      this.productName = productName;
    }

    setSubsidiaryName(subsidiaryName: string)
    {
      this.subsidiaryName = subsidiaryName;
    }

    getEmployeeName()
    {
      return this.employeeName;
    }

    getInventoryName()
    {
      return this.inventoryName;
    }

    getProductName()
    {
      return this.productName;
    }

    getSubsidiaryName()
    {
      return this.subsidiaryName;
    }

  //Métodos para obtener datos necesarios
}
