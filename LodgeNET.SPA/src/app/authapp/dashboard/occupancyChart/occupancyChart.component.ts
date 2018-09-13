import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { ChartData } from '../../../_models/charts/chartData';
import { ServiceOccupancySeries } from '../../../_models/charts/series/serviceOccupancySeries';
import { DataService } from '../../../_services/data.service';

@Component({
  selector: 'app-occupancyChart',
  templateUrl: './occupancyChart.component.html',
  styleUrls: ['./occupancyChart.component.css']
})
export class OccupancyChartComponent implements OnInit {
  chart: Chart;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getBuildingTypeOccupancyChart()
      .subscribe((result: ChartData<ServiceOccupancySeries>) => {
        this.chart = new Chart({
          chart: {
            type: 'bar'
          },
          title: {
            text: 'Service Occupancy',
            style: {
              fontFamily: 'Roboto',
              fontWeight: 'bold'
            }
          },
          colors: ['#2196f3', '#f34336', '#fec007', '#64E572', '#FF9655', '#607d8a', '#24CBE5', '#DDDF00', '#FFF263', '#6AF9C4'],
          credits: {
            enabled: false
          },
          xAxis: {
            categories: result.columns
          },
          yAxis: {
            min: 0,
            title: {
              text: 'Capacity'
            }
          },
          plotOptions: {
            series: {
                stacking: 'normal'
            }
          },
          series: result.series
        })
      }, () =>{});
  }

}
