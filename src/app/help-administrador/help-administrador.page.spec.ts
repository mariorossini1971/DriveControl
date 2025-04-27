import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpAdministradorPage } from './help-administrador.page';

describe('HelpAdministradorPage', () => {
  let component: HelpAdministradorPage;
  let fixture: ComponentFixture<HelpAdministradorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpAdministradorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
