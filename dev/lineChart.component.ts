import {Component, OnInit, AfterViewInit, OnDestroy, EventEmitter} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'my-line-chart',
  directives: [],
  // templateUrl: 'templates/app.tpl.html'
  template: `
  <h3>Number of paying customers Line Chart</h3>
  <div>
    <canvas id="myCanvas"></canvas>
  </div>
  `,
  inputs: ['keyInfoObservable']

})
export class LineChartComponent implements OnInit, AfterViewInit{

  keyInfoObservable: Observable<any>;
  keyInfoCsv: string = "";

  bunchObser: any;
  myEventEmitter: any;

  funcInSubs(data) {
    this.keyInfoCsv = data;
    let keyInfoTmp = this.keyInfoCsv.split('\n');
    let keyInfoJsonlike = [];
    for(let i=0; i<keyInfoTmp.length;i++) {
      let hereList = keyInfoTmp[i].split(',');
      if (hereList!="") {
        hereList[1]=+ hereList[1];
        keyInfoJsonlike.push(hereList);
      }
    }
    // draw line chart
    var ctx = document.getElementById("myCanvas");
    var labels:Array<any> = [];
    var numbList: Array<number> = [];
    for(let i=0; i<keyInfoJsonlike.length;i++) {
      labels.push(keyInfoJsonlike[i][0]]);
      numbList.push(keyInfoJsonlike[i][1]);
    }
    var data = {
        labels: labels,
        datasets: [
            {
                label: "Number of paying customers",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: numbList,
            }
        ]
    };
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: data
    });
  }

  ngOnInit():any {

    this.myEventEmitter = new EventEmitter<any>();
    var source = Observable.fromEvent(
      this.myEventEmitter,
      'done');

    this.keyInfoObservable.subscribe(
      data => this.funcInSubs(data),
      err => console.error(err)
    );

    this.bunchObser = Observable.interval(20000).takeUntil(source)
    .flatMap(() => {
      return this.keyInfoObservable;
    });
    this.bunchObser.subscribe(
      data => {
        this.funcInSubs(data);
      },
      err => console.error(err)
    );
  }

  ngAfterViewInit(): any {

  }

  ngOnDestroy(): any {
    this.myEventEmitter.emit('done');
  }

}
