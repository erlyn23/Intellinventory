import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EntradaRapidaPage } from './entrada-rapida.page';

describe('EntradaRapidaPage', () => {
  let component: EntradaRapidaPage;
  let fixture: ComponentFixture<EntradaRapidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntradaRapidaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EntradaRapidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
