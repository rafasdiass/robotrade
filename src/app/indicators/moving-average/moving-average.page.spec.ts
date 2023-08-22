import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovingAveragePage } from './moving-average.page';

describe('MovingAveragePage', () => {
  let component: MovingAveragePage;
  let fixture: ComponentFixture<MovingAveragePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MovingAveragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
