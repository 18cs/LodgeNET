/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OccupancyChartComponent } from './occupancyChart.component';

describe('OccupancyChartComponent', () => {
  let component: OccupancyChartComponent;
  let fixture: ComponentFixture<OccupancyChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupancyChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupancyChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
