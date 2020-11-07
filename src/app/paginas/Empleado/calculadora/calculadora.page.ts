import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
})
export class CalculadoraPage implements OnInit {

  value1:number;
  value2:number;
  operationResult:number;
  operationsHistory: string[] = [];
  constructor(private menuCtrl:MenuController,
    private platform: Platform, private router: Router) { 
      this.platform.backButton.subscribeWithPriority(10, ()=>{
        this.router.navigate(['dashboard']);
      })
    }

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  doOperation(operation: string)
  {
    if(operation == 'sumar')
    {
      this.operationResult = this.value1 + this.value2;
      this.operationsHistory.push(`Resultado suma: ${this.operationResult}`);

    }else if(operation == 'restar'){
      
      this.operationResult = this.value1 - this.value2;
      this.operationsHistory.push(`Resultado resta: ${this.operationResult}`);

    }else if(operation == 'multiplicar'){

      this.operationResult = this.value1 * this.value2;
      this.operationsHistory.push(`Resultado multiplicación: ${this.operationResult}`);

    }else if(operation == 'dividir'){

      this.operationResult = this.value1 / this.value2;
      this.operationsHistory.push(`Resultado división: ${this.operationResult}`);
      
    }else if(operation == 'descuento'){
      let percent = this.value2 / 100;
      let discount = this.value1 * percent;
      this.operationResult = this.value1 - discount;

      this.operationsHistory.push(`Descuento aplicado: ${this.operationResult}`);
    }
  }

  clearInputs()
  {
    this.operationResult = null;
    this.value1 = null;
    this.value2 = null;
  }
}
