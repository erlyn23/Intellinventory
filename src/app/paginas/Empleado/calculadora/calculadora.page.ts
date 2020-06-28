import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.page.html',
  styleUrls: ['./calculadora.page.scss'],
})
export class CalculadoraPage implements OnInit {

  valor1:number;
  valor2:number;
  resultado:number;
  historial: any[] = [];
  constructor(private menuCtrl:MenuController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true, 'first');
  }

  Operar(operacion: string)
  {
    if(operacion == 'sumar')
    {
      this.resultado = this.valor1 + this.valor2;
      this.historial.push(`Resultado suma: ${this.resultado}`);

    }else if(operacion == 'restar'){
      
      this.resultado = this.valor1 - this.valor2;
      this.historial.push(`Resultado resta: ${this.resultado}`);

    }else if(operacion == 'multiplicar'){

      this.resultado = this.valor1 * this.valor2;
      this.historial.push(`Resultado multiplicación: ${this.resultado}`);

    }else if(operacion == 'dividir'){

      this.resultado = this.valor1 / this.valor2;
      this.historial.push(`Resultado división: ${this.resultado}`);
      
    }
  }

  limpiar()
  {
    this.resultado = null;
    this.valor1 = null;
    this.valor2 = null;
  }
}
