import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimpleInterestPage } from './simple-interest.page';

describe('SimpleInterestPage', () => {
  let component: SimpleInterestPage;
  let fixture: ComponentFixture<SimpleInterestPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SimpleInterestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
