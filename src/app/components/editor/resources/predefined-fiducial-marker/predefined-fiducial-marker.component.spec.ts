import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedFiducialMarkerComponent } from './predefined-fiducial-marker.component';

describe('PredefinedMarkerComponent', () => {
  let component: PredefinedFiducialMarkerComponent;
  let fixture: ComponentFixture<PredefinedFiducialMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredefinedFiducialMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedFiducialMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
