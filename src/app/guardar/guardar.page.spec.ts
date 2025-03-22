import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuardarPage } from './guardar.page';

describe('GuardarPage', () => {
  let component: GuardarPage;
  let fixture: ComponentFixture<GuardarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
