import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-notas-salida',
  templateUrl: './notas-salida.component.html',
  styleUrls: ['./notas-salida.component.scss'],
})
export class NotasSalidaComponent implements OnInit {

  ref: any;
  notas: any[] =[];
  constructor(private modalCtrl: ModalController,
    private db: AngularFireDatabase,
    private datos: DatosService) { }

  ngOnInit() {
    const claveBar = this.datos.getClave();
    const sucursal = this.datos.getSucursal();
    const cedula = this.datos.getCedula();
    const inventario = this.datos.getKey();
    const producto = this.datos.getCode();

    this.ref = this.db.object(claveBar+'/Sucursales/'+sucursal+'/Inventarios/'+cedula+'/'+inventario+'/Productos/'+producto+'/NotasSalidas');
    this.ref.snapshotChanges().subscribe(data=>{
      let notas = data.payload.val();
      this.notas = [];
      for(let i in notas){
        notas[i].key = i;
        this.notas.push(notas[i]);
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
