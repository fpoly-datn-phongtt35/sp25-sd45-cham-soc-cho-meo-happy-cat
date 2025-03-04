import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewusergioithieuComponent } from './viewusergioithieu.component';

describe('ViewusergioithieuComponent', () => {
  let component: ViewusergioithieuComponent;
  let fixture: ComponentFixture<ViewusergioithieuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewusergioithieuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewusergioithieuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
