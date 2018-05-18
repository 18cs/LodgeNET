/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GueststaydialogComponent } from './gueststaydialog.component';

describe('GueststaydialogComponent', () => {
  let component: GueststaydialogComponent;
  let fixture: ComponentFixture<GueststaydialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GueststaydialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GueststaydialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
