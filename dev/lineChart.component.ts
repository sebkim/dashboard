import {Component, OnInit, AfterViewInit} from '@angular/core';
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
  keyInfoJson: any = [];

  ngOnInit():any {
    this.keyInfoObservable.subscribe (
      data => { this.keyInfoJson = data},
      err => console.error(err),
      () => {
        // draw line chart
        var ctx = document.getElementById("myCanvas");
        var labels:Array<any> = [];
        var numbList: Array<number> = [];
        for(let i=0; i<this.keyInfoJson.length;i++) {
          labels.push(this.keyInfoJson[i].period);
          numbList.push(this.keyInfoJson[i].numbOfPayingCus);
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
    );
  }

  ngAfterViewInit(): any {

  }

}
