import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedMarkerComponent } from './predefined-fiducial-marker.component';

describe('PredefinedMarkerComponent', () => {
  let component: PredefinedMarkerComponent;
  let fixture: ComponentFixture<PredefinedMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredefinedMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
