import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DichVuComponent } from './dichvu.component';

describe('DichvuComponent', () => {
  let component: DichVuComponent;
  let fixture: ComponentFixture<DichVuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DichVuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DichVuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
