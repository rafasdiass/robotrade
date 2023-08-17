import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LiveFeedPage } from './live-feed.page';

describe('LiveFeedPage', () => {
  let component: LiveFeedPage;
  let fixture: ComponentFixture<LiveFeedPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LiveFeedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
