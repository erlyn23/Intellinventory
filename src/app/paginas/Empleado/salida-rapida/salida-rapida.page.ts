import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-salida-rapida',
  templateUrl: './salida-rapida.page.html',
  styleUrls: ['./salida-rapida.page.scss'],
})
export class SalidaRapidaPage implements OnInit {

  formulario: FormGroup;
  ref: any;
  sucursales: any[] = [];
  inventarios: any[] = [];
  necesitaClave: boolean;
  cedulaAjena: any;
  errorMessage: any = "";
  errorMessage2: any = "";
  sucursal: any = "";
  producto: any = "";
  inventario: any = "";
  SalidaAnterior: number = 0;
  constructor(private menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private datos: DatosService,
    private servicio: GeneralService,
    private db: AngularFireDatabase) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      Codigo: ["", [Validators.required]],
      Sucursal: ["", [Validators.required]],
      Password: [""],
      Inventario: ["", [Validators.required]],
      Cantidad: ["", [Validators.required]],
      NotaSalida: ["", [Validators.required]]
    });
    this.getSucursales();
    this.getEmpleado();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  getEmpleado(){
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.ref = this.db.object(clave+'/Empleados/'+cedula);
    this.ref.snapshotChanges().subscribe(data=>{
      let nombre = data.payload.val();
      this.datos.setNombreEmpleado(nombre.Nombre);
    });
  }

  getSucursales(){
    const claveBar = this.datos.getClave();

    this.ref = this.db.object(claveBar+'/Sucursales/');
    this.ref.snapshotChanges().subscribe(data=>{
      let sucursals = data.payload.val();
      this.sucursales = []; 
      for(let i in sucursals){
        sucursals[i].key = i;
        this.sucursales.push(sucursals[i]);
      }
    })
  }

  buscarSucursal(val)
  {
    const claveBar = this.datos.getClave(); 
    const cedula = this.datos.getCedula();

    this.Password.setValue('');
    this.Codigo.setValue('');
    this.errorMessage = "";
    if(val.detail.value != '')
    {
      this.ref = this.db.object(claveBar+'/Sucursales/'+val.detail.value);
      this.ref.snapshotChanges().subscribe(data=>{
        let sucursals = data.payload.val();
        this.sucursal = "";
        if(sucursals != null){
          this.sucursal = sucursals;
          this.datos.setNombreSucursal(sucursals.Nombre);
        }
        if(cedula != this.sucursal.Jefe)
        {
          this.necesitaClave = true;
        }else{
          this.necesitaClave = false;
        }
      });
      this.datos.setSucursal(val.detail.value);
      this.getInventarios(val.detail.value, 0);
    }
  }

  getInventarios(sucursal: any, ced: any){
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();

    this.Codigo.setValue('');
    this.errorMessage2 = "";
    if(ced == 0)
    {
      this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula);
      this.ref.snapshotChanges().subscribe(data=>{
        let inventorys = data.payload.val();
        this.inventarios = [];
        for(let i in inventorys){
          if(inventorys[i].Estado != 'Finalizado')
          {
            inventorys[i].key = i;
            this.inventarios.push(inventorys[i]);
          }
        }
      });
    }else{
      this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+ced);
      this.ref.snapshotChanges().subscribe(data=>{
        let inventorys = data.payload.val();
        this.inventarios = [];
        for(let i in inventorys){
          if(inventorys[i].Estado != 'Finalizado')
          {
            inventorys[i].key = i;
            this.inventarios.push(inventorys[i]);
          }
        }
      });
    }
  }

  inventarioAjeno(val:any)
  {
    if(val.detail.value == this.sucursal.Password)
    {
      this.cedulaAjena = this.sucursal.Jefe;
      this.getInventarios(this.formulario.value.Sucursal, this.cedulaAjena);
      this.errorMessage = "";
    }else{
      this.inventarios = [];
      this.errorMessage = "Contraseña incorrecta";
    }
  }

  buscarInventario(val){
    const claveBar = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const sucursal = this.datos.getSucursal();

    this.Codigo.setValue("");
    if(val.detail.value != ''){
      if(this.cedulaAjena != undefined && this.necesitaClave)
      {
        this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+val.detail.value);
        this.ref.snapshotChanges().subscribe(data=>{
          let inventorys = data.payload.val();
          this.inventario = "";
          if(inventorys != null){
            this.inventario = inventorys;
            this.datos.setNombreInventario(inventorys.NombreInventario)
          }
        });
        this.datos.setKey(val.detail.value);
      }else{
        this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+val.detail.value);
        this.ref.snapshotChanges().subscribe(data=>{
          let inventorys = data.payload.val();
          this.inventario = "";
          if(inventorys != null){
            this.inventario = inventorys;
            this.datos.setNombreInventario(inventorys.NombreInventario);
          }
        });
        this.datos.setKey(val.detail.value);
      }
    }
  }

  getProducto(val: any){
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const inventario = this.Inventario.value;
    const sucursal = this.Sucursal.value;
    
    if(this.cedulaAjena != undefined && this.necesitaClave)
    {
      if(val.detail.value != '')
      {
        this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+val.detail.value);
        this.ref.snapshotChanges().subscribe(data=>{
          let producto = data.payload.val();
          this.producto = "";
          if(producto != null){
            this.producto = producto;
            this.datos.setNombreProducto(producto.Nombre);
            this.errorMessage2 = "";
          }else{
            this.errorMessage2 = "El producto no existe."
          }
        })
        this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+val.detail.value+'/Salida');
        this.ref.snapshotChanges().subscribe(data=>{
          let cantidad = data.payload.val();
          this.SalidaAnterior = 0;
          this.SalidaAnterior = cantidad;
        });
      }
    }else{
      if(val.detail.value != '')
      {
          this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+val.detail.value);
          this.ref.snapshotChanges().subscribe(data=>{
          let producto = data.payload.val();
          this.producto = "";
          if(producto != null){
            this.producto = producto;
            this.datos.setNombreProducto(producto.Nombre);
            this.errorMessage2 = "";
          }else{
            this.errorMessage2 = "El producto no existe.";
          }
        })
        this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+val.detail.value+'/Salida');
        this.ref.snapshotChanges().subscribe(data=>{
          let cantidad = data.payload.val();
          this.SalidaAnterior = 0;
          this.SalidaAnterior = cantidad;
        });
      }
    }
  }
  
  leerCodigo(){
    this.servicio.leerCodigo().then(async ()=>{

      let code = await Clipboard.read(); 
      this.formulario.controls.Codigo.setValue(code.value);
    })
    this.servicio.mensaje('toastSuccess', 'Código leído, pegue el código en el campo.')
  }

  darSalida(){
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const sucursal = this.Sucursal.value;
    const password = this.Password.value;
    const inventario = this.Inventario.value;
    const producto = this.Codigo.value;

      if(this.formulario.valid && this.errorMessage2 == ""){
        if(this.necesitaClave){
          this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+producto)
          .update({
            Salida: this.SalidaAnterior + this.Cantidad.value
          }).then(()=>{
            this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+producto+'/NotasSalidas').push({
              Nota: this.NotaSalida.value
            });
            this.db.database.ref(clave+'/ParaNotificaciones/Salidas').push({
              NombreEmpleado: this.datos.getNombreEmpleado(),
              NombreSucursal: this.datos.getNombresucursal(),
              NombreInventario: this.datos.getNombreInventario(),
              NombreProducto: this.datos.getNombreProducto()
            });
            this.servicio.mensaje('toastSuccess', 'Salida hecha correctamente').then(()=>{
              this.formulario.reset();
            this.necesitaClave = false;
            });
          }).catch(err=>{
            console.log(err);
            this.servicio.mensaje('customToast', err);
          })
      }
      else
      {
          this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto)
            .update({
              Salida: this.SalidaAnterior + this.Cantidad.value
            }).then(()=>{
              this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto+'/NotasSalidas').push({
                Nota: this.NotaSalida.value
              });
              this.db.database.ref(clave+'/ParaNotificaciones/Salidas').push({
                NombreEmpleado: this.datos.getNombreEmpleado(),
                NombreSucursal: this.datos.getNombresucursal(),
                NombreInventario: this.datos.getNombreInventario(),
                NombreProducto: this.datos.getNombreProducto()
              });
              this.servicio.mensaje('toastSuccess', 'Salida hecha correctamente').then(()=>{
                this.formulario.reset();
              this.necesitaClave = false;
              });
              }).catch(err=>{
              console.log(err);
              this.servicio.mensaje('customToast', err);
          })
        }
       
      }else{
        this.servicio.mensaje('customToast', 'La contraseña es incorrecta o el producto no existe');
      }
  }

  get Codigo()
  {
    return this.formulario.get('Codigo');
  }

  get Sucursal()
  {
    return this.formulario.get('Sucursal');
  }

  get Password()
  {
    return this.formulario.get('Password');
  }

  get Inventario()
  {
    return this.formulario.get('Inventario');
  }

  get Cantidad()
  {
    return this.formulario.get('Cantidad');
  }

  get NotaSalida()
  {
    return this.formulario.get('NotaSalida');
  }


}
