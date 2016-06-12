import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'my-bar-chart',
  directives: [],
  // templateUrl: 'templates/app.tpl.html'
  template: `
  <h3>Number of reported issues</h3>
  <div>
    <canvas id="myCanvasBar"></canvas>
  </div>

  `,
  inputs: ['dataInfoObservable']

})
export class BarChartComponent implements OnInit {

  dataInfoObservable: Observable<any>;
  dataInfoJson: any = [];

  ngOnInit():any {
    this.dataInfoObservable.subscribe (
      data => { this.dataInfoJson = data},
      err => console.error(err),
      () => {

        let periodObj={};
        for(let i=0; i<this.dataInfoJson.length; i++) {
          let periodSplitted=this.dataInfoJson[i].period.split(' ');
          if(periodObj[periodSplitted[1]] == undefined) {
            periodObj[periodSplitted[1]]=1;
          } else {
            periodObj[periodSplitted[1]]+=1;
          }
        }

        // draw bar chart
        var ctx = document.getElementById("myCanvasBar");
        var labels:Array<any> = [];
        var numbList: Array<number> = [];
        labels=Object.keys(periodObj);
        for(let i=0; i<labels.length; i++) {
          labels[i]="2016 / " + labels[i];
        }
        numbList=Object.values(periodObj);

        var data = {
            labels: labels,
            datasets: [
                {
                    label: "Number of reported issues",
                    backgroundColor: "rgba(255,99,132,0.2)",
                    borderColor: "rgba(255,99,132,1)",
                    borderWidth: 1,
                    hoverBackgroundColor: "rgba(255,99,132,0.4)",
                    hoverBorderColor: "rgba(255,99,132,1)",
                    data: numbList,
                }
            ]
        };
        var options = {
            scales: {
                yAxes: [{
                    display: true,
                    ticks: {
                        beginAtZero: true   // minimum value will be 0.
                    }
                }]
            }
        };
        var myBarChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
      }
    );
  }

}
