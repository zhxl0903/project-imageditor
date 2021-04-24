import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenu2dComponent } from './side-menu2d.component';

describe('SideMenu2dComponent', () => {
  let component: SideMenu2dComponent;
  let fixture: ComponentFixture<SideMenu2dComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideMenu2dComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenu2dComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
