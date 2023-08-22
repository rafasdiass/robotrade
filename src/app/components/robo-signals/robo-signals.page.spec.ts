import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoboSignalsPage } from './robo-signals.page';

describe('RoboSignalsPage', () => {
  let component: RoboSignalsPage;
  let fixture: ComponentFixture<RoboSignalsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RoboSignalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
