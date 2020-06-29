import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockViewComponent } from './clock-view.component';

describe('ClockViewComponent', () => {
  let component: ClockViewComponent;
  let fixture: ComponentFixture<ClockViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
