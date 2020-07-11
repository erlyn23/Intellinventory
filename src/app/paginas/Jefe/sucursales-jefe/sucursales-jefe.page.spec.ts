import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SucursalesJefePage } from './sucursales-jefe.page';

describe('SucursalesJefePage', () => {
  let component: SucursalesJefePage;
  let fixture: ComponentFixture<SucursalesJefePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursalesJefePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SucursalesJefePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
