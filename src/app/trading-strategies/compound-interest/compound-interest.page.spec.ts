import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompoundInterestPage } from './compound-interest.page';

describe('CompoundInterestPage', () => {
  let component: CompoundInterestPage;
  let fixture: ComponentFixture<CompoundInterestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CompoundInterestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
