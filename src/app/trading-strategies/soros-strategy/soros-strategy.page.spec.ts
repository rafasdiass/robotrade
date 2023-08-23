import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SorosStrategyPage } from './soros-strategy.page';

describe('SorosStrategyPage', () => {
  let component: SorosStrategyPage;
  let fixture: ComponentFixture<SorosStrategyPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SorosStrategyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
