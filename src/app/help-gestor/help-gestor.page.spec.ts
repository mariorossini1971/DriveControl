import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpGestorPage } from './help-gestor.page';

describe('HelpGestorPage', () => {
  let component: HelpGestorPage;
  let fixture: ComponentFixture<HelpGestorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpGestorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
