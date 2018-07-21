import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolyComponent } from './poly.component';

describe('PolyComponent', () => {
  let component: PolyComponent;
  let fixture: ComponentFixture<PolyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PolyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
