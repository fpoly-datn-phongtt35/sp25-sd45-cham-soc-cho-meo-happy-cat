import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { kmComponent } from './km.component';

describe('kmComponent', () => {
  let component: kmComponent;
  let fixture: ComponentFixture<kmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ kmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(kmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
