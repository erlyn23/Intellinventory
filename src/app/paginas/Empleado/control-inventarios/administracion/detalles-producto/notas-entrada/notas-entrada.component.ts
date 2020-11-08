import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { ModalController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ProductNote } from 'src/app/shared/models/ProductNote';

@Component({
  selector: 'app-notas-entrada',
  templateUrl: './notas-entrada.component.html',
  styleUrls: ['./notas-entrada.component.scss'],
})
export class NotasEntradaComponent implements OnInit {

  productEntryNotes: ProductNote[] =[];
  constructor(private modalCtrl: ModalController,
    private db: AngularFireDatabase,
    private generalSvc: GeneralService) { }

  ngOnInit() {
    const productEntryNoteDbObject: AngularFireObject<ProductNote> = this.db
    .object(this.generalSvc.getSpecificObjectRoute('NotasEntrada'));
    
    productEntryNoteDbObject.snapshotChanges().subscribe(productNotesData=>{
      let notes = productNotesData.payload.val();
      this.productEntryNotes = [];
      for(let i in notes){
        notes[i].Key = i;
        this.productEntryNotes.push(notes[i]);
      }
    })
  }

  goBack(){
    this.modalCtrl.dismiss();
  }

}
