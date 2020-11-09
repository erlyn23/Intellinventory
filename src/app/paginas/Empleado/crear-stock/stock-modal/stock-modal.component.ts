import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { GeneralService } from 'src/app/services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { Stock } from 'src/app/shared/models/Stock';

const { Clipboard } = Plugins; 

@Component({
  selector: 'app-stock-modal',
  templateUrl: './stock-modal.component.html',
  styleUrls: ['./stock-modal.component.scss'],
})
export class StockModalComponent implements OnInit {

  form: FormGroup;
  constructor(private formBuilder: FormBuilder,
    private modalCtrl: ModalController,
    private angularFireDatabase: AngularFireDatabase, 
    private generalSvc: GeneralService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      Code: ["",[Validators.required]],
      Name: ["",[Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      Cuantity: ["",[Validators.required]]
    });
  }

  searchStock(val:any){
    const stockDbObject: AngularFireObject<Stock>= this.angularFireDatabase
    .object(`${this.generalSvc.getSpecificObjectRoute('Stocks')}/${val.detail.value}`);
    stockDbObject.valueChanges().subscribe(stockData=>{
      if(stockData != null)
      {
        this.Name.setValue(stockData.Name);
        this.Cuantity.setValue(stockData.Cuantity);
      }else{
        this.Name.setValue("");
        this.Cuantity.setValue("");
      }
    })
  }

  saveStock()
  {
    if(this.form.valid)
    {
      this.angularFireDatabase.database.ref(`${this.generalSvc.getSpecificObjectRoute('Stocks')}/${this.Code.value}`)
      .set({
        Code: this.Code.value,
        Name: this.Name.value,
        Cuantity: this.Cuantity.value
      }).then(()=>{
        this.generalSvc.presentToast('toastSuccess', 'Stock guardado correctamente');
        this.modalCtrl.dismiss();
      }).catch(err=>{
        this.generalSvc.presentToast('customToast',err);
      })
    }
  }
  
  
  readBarCode(){
    this.generalSvc.readBarCode().then(async ()=>{

      let code = await Clipboard.read(); 
      this.Code.setValue(code.value);
    })
    
    this.generalSvc.presentToast('toastSuccess', 'Código leído, pegue el código en el campo.')
  }

  goBack()
  {
    this.modalCtrl.dismiss();
  }

  get Code(){
    return this.form.get('Code');
  }

  get Name(){
    return this.form.get('Name');
  }

  get Cuantity(){
    return this.form.get('Cuantity');
  }

}
