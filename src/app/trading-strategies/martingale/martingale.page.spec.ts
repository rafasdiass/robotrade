import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MartingalePage } from './martingale.page';

describe('MartingalePage', () => {
  let component: MartingalePage;
  let fixture: ComponentFixture<MartingalePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MartingalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
