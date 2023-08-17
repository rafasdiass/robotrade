import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TradeHistoryPage } from './trade-history.page';

describe('TradeHistoryPage', () => {
  let component: TradeHistoryPage;
  let fixture: ComponentFixture<TradeHistoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TradeHistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
