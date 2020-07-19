import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { GeneralService } from 'src/app/services/general.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';

const { Clipboard } = Plugins;

@Component({
  selector: 'app-entrada-rapida',
  templateUrl: './entrada-rapida.page.html',
  styleUrls: ['./entrada-rapida.page.scss'],
})
export class EntradaRapidaPage implements OnInit {

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
      NotaEntrada: ["", [Validators.required]]
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
        this.sucursal = sucursals;
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

    if(val.detail.value != '')
    {
      if(this.cedulaAjena != undefined && this.necesitaClave)
      {
          this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+val.detail.value);
          this.ref.snapshotChanges().subscribe(data=>{
          let inventorys = data.payload.val();
          this.inventario = "";
          this.inventario = inventorys;
        });
        this.datos.setKey(val.detail.value);
      }else{
        this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+val.detail.value);
        this.ref.snapshotChanges().subscribe(data=>{
          let inventorys = data.payload.val();
          this.inventario = "";
          this.inventario = inventorys;
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
    let codigo = val.detail.value;
    
    if(codigo != '')
    {
      if(this.cedulaAjena != undefined && this.necesitaClave)
      {
        this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+codigo);
        this.ref.snapshotChanges().subscribe(data=>{
          let producto = data.payload.val();
          this.producto = "";
          if(producto != null){
            this.producto = producto;
            this.datos.setNombreProducto(this.producto.Nombre);
            this.errorMessage2 = "";
          }else{
            this.errorMessage2 = "El producto no existe."
          }
        })
      }else{
        this.ref = this.db.object(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+codigo);
        this.ref.snapshotChanges().subscribe(data=>{
          let producto = data.payload.val();
          this.producto = "";
          if(producto != null){
            this.producto = producto;
            this.datos.setNombreProducto(this.producto.Nombre);
            this.errorMessage2 = "";
          }else{
            this.errorMessage2 = "El producto no existe.";
          }
        })
      }
    }
  }

  leerCodigo(){
    this.servicio.leerCodigo().then(async (codigo)=>{

      let code = await Clipboard.read(); 
      this.formulario.controls.Codigo.setValue(code.value);
    })
  }

  darEntrada(){
    const clave = this.datos.getClave();
    const cedula = this.datos.getCedula();
    const sucursal = this.formulario.value.Sucursal;
    const inventario = this.formulario.value.Inventario;
    const producto = this.formulario.value.Codigo;

      if(this.formulario.valid && this.errorMessage2 == ""){
        if(this.necesitaClave){
            this.Password.setValidators(Validators.required);
            this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+producto)
            .update({
              Entrada: this.formulario.value.Cantidad
            }).then(()=>{
              this.db.database.ref(clave+'/ParaNotificaciones/Entradas').push({
                NombreEmpleado: this.datos.getNombreEmpleado(),
                NombreSucursal: this.sucursal.Nombre,
                NombreInventario: this.inventario.NombreInventario,
                NombreProducto: this.datos.getNombreProducto()
              });
              
              this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+this.cedulaAjena+'/'+inventario+'/Productos/'+producto+'/NotasEntrada').push({
                Nota: this.formulario.value.NotaEntrada
              });
              this.servicio.mensaje('toastSuccess', 'Entrada hecha correctamente').then(()=>{
                this.formulario.reset();
                this.necesitaClave = false;
              })
            }).catch(err=>{
              this.servicio.mensaje('customToast', err);
            })
        }else{
          this.Password.clearValidators();
          this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto)
            .update({
              Entrada: this.formulario.value.Cantidad
            }).then(()=>{
              this.db.database.ref(clave+'/ParaNotificaciones/Entradas').push({
                NombreEmpleado: this.datos.getNombreEmpleado(),
                NombreSucursal: this.sucursal.Nombre,
                NombreInventario: this.inventario.NombreInventario,
                NombreProducto: this.datos.getNombreProducto()
              });
              
              this.db.database.ref(clave+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto+'/NotasEntrada').push({
                Nota: this.formulario.value.NotaEntrada
              });
              this.servicio.mensaje('toastSuccess', 'Entrada hecha correctamente').then(()=>{
                this.formulario.reset();
                this.necesitaClave = false;
              });
            }).catch(err=>{
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

  get NotaEntrada()
  {
    return this.formulario.get('NotaEntrada');
  }

}
