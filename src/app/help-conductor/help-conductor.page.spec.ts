import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HelpConductorPage } from './help-conductor.page';

describe('HelpConductorPage', () => {
  let component: HelpConductorPage;
  let fixture: ComponentFixture<HelpConductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpConductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
