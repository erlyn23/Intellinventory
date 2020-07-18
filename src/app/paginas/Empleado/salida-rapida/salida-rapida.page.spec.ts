import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SalidaRapidaPage } from './salida-rapida.page';

describe('SalidaRapidaPage', () => {
  let component: SalidaRapidaPage;
  let fixture: ComponentFixture<SalidaRapidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalidaRapidaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SalidaRapidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
