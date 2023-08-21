import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradingStrategiesPage } from './trading-strategies.page';

describe('TradingStrategiesPage', () => {
  let component: TradingStrategiesPage;
  let fixture: ComponentFixture<TradingStrategiesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TradingStrategiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
