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
        <h3>Number of Open Issues : {{numOpenIssue}}</h3>
        <hr>
        <my-line-chart [keyInfoObservable]="keyInfoObservable"></my-line-chart>
        <hr>
        <my-bar-chart [dataInfoObservable]="dataInfoObservable"></my-bar-chart>
      </div>
    </div>

  `,

})
export class KeyComponent implements OnInit {

  dataInfoJson: any = [];
  openIssueList: any = [];
  numOpenIssue: number;

  keyInfoObservable: Observable<any>;
  dataInfoObservable: Observable<any>;

  constructor(private _http: Http) { }

  ngOnInit():any {
    // read datainfo json.
    this.dataInfoObservable = this._http.get('json/dataInfo.json')
      .map((res:Response) => res.json());

    this.dataInfoObservable.subscribe(
        data => { this.dataInfoJson = data},
        err => console.error(err),
        () => {
          // number of open issues
          for(let i=0; i<this.dataInfoJson.length; i++) {
            if(this.dataInfoJson[i].open == 'open') {
              this.openIssueList.push(this.dataInfoJson[i]);
            }
          }
          this.numOpenIssue = this.openIssueList.length;
        } // end of ()=> {}
      );
    // read keyinfo json.
    this.keyInfoObservable = this._http.get('json/keyInfo.json')
      .map((res:Response) => res.json());
  }
}
