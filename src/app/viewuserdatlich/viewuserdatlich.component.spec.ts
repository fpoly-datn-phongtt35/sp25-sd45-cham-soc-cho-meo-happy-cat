import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewuserdatlichComponent } from './viewuserdatlich.component';

describe('ViewuserdatlichComponent', () => {
  let component: ViewuserdatlichComponent;
  let fixture: ComponentFixture<ViewuserdatlichComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewuserdatlichComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewuserdatlichComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
