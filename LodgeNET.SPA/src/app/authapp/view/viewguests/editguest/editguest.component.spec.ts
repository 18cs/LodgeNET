/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditguestComponent } from './editguest.component';

describe('EditguestComponent', () => {
  let component: EditguestComponent;
  let fixture: ComponentFixture<EditguestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditguestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditguestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
