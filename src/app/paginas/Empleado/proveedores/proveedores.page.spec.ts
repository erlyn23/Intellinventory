import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProveedoresPage } from './proveedores.page';

describe('ProveedoresPage', () => {
  let component: ProveedoresPage;
  let fixture: ComponentFixture<ProveedoresPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveedoresPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedoresPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
