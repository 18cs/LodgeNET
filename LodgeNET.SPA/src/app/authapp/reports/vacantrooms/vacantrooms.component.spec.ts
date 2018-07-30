/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VacantroomsComponent } from './vacantrooms.component';

describe('VacantroomsComponent', () => {
  let component: VacantroomsComponent;
  let fixture: ComponentFixture<VacantroomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacantroomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacantroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
