import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ControlInventariosPage } from './control-inventarios.page';

describe('ControlInventariosPage', () => {
  let component: ControlInventariosPage;
  let fixture: ComponentFixture<ControlInventariosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlInventariosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlInventariosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
