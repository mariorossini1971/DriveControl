import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajeDetallePage } from './viaje-detalle.page';

describe('ViajeDetallePage', () => {
  let component: ViajeDetallePage;
  let fixture: ComponentFixture<ViajeDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajeDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
