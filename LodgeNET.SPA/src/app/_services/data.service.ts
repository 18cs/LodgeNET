import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ChartData } from '../_models/charts/chartData';
import { ServiceOccupancySeries } from '../_models/charts/series/serviceOccupancySeries';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  baseUrl = environment.apiUrl;

constructor(private http: HttpClient) { }

getBuildingTypeOccupancyChart() {
  return this.http.get<ChartData<ServiceOccupancySeries>>(this.baseUrl + 'data/buildingtypeoccupancyservice');
}

}
