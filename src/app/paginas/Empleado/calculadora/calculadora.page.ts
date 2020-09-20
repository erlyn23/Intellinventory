import { Component, OnInit } from '@angular/core';
import { MenuController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';

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
      
    }else if(operacion == 'descuento'){
      let porciento = this.valor2 / 100;
      let descuento = this.valor1 * porciento;
      this.resultado = this.valor1 - descuento;

      this.historial.push(`Descuento aplicado: ${this.resultado}`);
    }
  }

  limpiar()
  {
    this.resultado = null;
    this.valor1 = null;
    this.valor2 = null;
  }
}
