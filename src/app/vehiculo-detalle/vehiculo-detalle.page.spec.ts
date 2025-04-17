import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehiculoDetallePage } from './vehiculo-detalle.page';

describe('VehiculoDetallePage', () => {
  let component: VehiculoDetallePage;
  let fixture: ComponentFixture<VehiculoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiculoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
