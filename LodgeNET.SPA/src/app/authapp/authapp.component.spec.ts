/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AuthappComponent } from './authapp.component';

describe('AuthappComponent', () => {
  let component: AuthappComponent;
  let fixture: ComponentFixture<AuthappComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthappComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthappComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
