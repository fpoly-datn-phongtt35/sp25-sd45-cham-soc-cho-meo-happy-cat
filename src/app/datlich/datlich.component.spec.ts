import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatlichComponent } from './datlich.component';

describe('DatlichComponent', () => {
  let component: DatlichComponent;
  let fixture: ComponentFixture<DatlichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatlichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatlichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
