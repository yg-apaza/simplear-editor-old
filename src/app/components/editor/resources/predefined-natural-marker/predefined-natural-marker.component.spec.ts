import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedNaturalMarkerComponent } from './predefined-natural-marker.component';

describe('PredefinedNaturalMarkerComponent', () => {
  let component: PredefinedNaturalMarkerComponent;
  let fixture: ComponentFixture<PredefinedNaturalMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PredefinedNaturalMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedNaturalMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
