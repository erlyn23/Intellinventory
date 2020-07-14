import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PedirClaveComponent } from './pedir-clave.component';

describe('PedirClaveComponent', () => {
  let component: PedirClaveComponent;
  let fixture: ComponentFixture<PedirClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedirClaveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PedirClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
