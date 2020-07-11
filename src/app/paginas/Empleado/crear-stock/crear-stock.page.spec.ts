import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearStockPage } from './crear-stock.page';

describe('CrearStockPage', () => {
  let component: CrearStockPage;
  let fixture: ComponentFixture<CrearStockPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearStockPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearStockPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
