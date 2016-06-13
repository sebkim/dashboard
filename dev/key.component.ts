import {Component, OnInit} from '@angular/core';
import {Http, Response} from '@angular/http';
// import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';
import {LineChartComponent} from './lineChart.component';
import {BarChartComponent} from './barChart.component';

@Component({
  selector: 'my-key',
  directives: [LineChartComponent, BarChartComponent],
  // templateUrl: 'templates/app.tpl.html'
  template: `
    <div class="row">
      <div class="col-md-6">
        <my-line-chart [keyInfoObservable]="keyInfoObservable"></my-line-chart>
        <hr>
        <my-bar-chart [dataInfoObservable]="dataInfoObservable"></my-bar-chart>
      </div>
    </div>
  `,

})
export class KeyComponent implements OnInit, OnDestroy {

  keyInfoObservable: Observable<any>;
  dataInfoObservable: Observable<any>;

  constructor(private _http: Http) { }

  ngOnInit():any {

    // read datainfo json.
    this.dataInfoObservable = this._http.get('json/dataInfo.json')
      .map((res:Response) => res.json());

    // read keyinfo json.
    // this.keyInfoObservable = this._http.get('json/keyInfo.json')
    //   .map((res:Response) => res.json());

    this.keyInfoObservable = this._http.get('json/keyInfo.csv')
    .map((res:Response) => res.text());
  }

}
