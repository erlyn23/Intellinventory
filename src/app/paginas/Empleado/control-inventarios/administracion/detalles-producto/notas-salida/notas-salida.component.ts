import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ProductNote } from 'src/app/shared/models/ProductNote';

@Component({
  selector: 'app-notas-salida',
  templateUrl: './notas-salida.component.html',
  styleUrls: ['./notas-salida.component.scss'],
})
export class NotasSalidaComponent implements OnInit {

  productExitNotes: ProductNote[] =[];
  constructor(private modalCtrl: ModalController,
    private angularFireDatabase: AngularFireDatabase,
    private generalSvc: GeneralService) { }

  ngOnInit() {
    const productExitNotesObject: AngularFireObject<ProductNote>  = this.angularFireDatabase
    .object(this.generalSvc.getSpecificObjectRoute('NotasSalidas'));
    
    productExitNotesObject.snapshotChanges().subscribe(exitNotesData=>{
      let notes = exitNotesData.payload.val();
      this.productExitNotes = [];
      for(let i in notes){
        notes[i].Key = i;
        this.productExitNotes.push(notes[i]);
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }
}
