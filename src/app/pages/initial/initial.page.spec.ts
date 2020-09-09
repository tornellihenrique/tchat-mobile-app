import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InitialPage } from './initial.page';

describe('InitialPage', () => {
  let component: InitialPage;
  let fixture: ComponentFixture<InitialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InitialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
