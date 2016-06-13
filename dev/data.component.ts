import {Component, OnInit, OnDestroy, EventEmitter} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'my-data',
  directives: [],
  // templateUrl: 'templates/app.tpl.html'
  template: `
    <h2>Issue Data</h2>
    <hr>
    <p style="font-size: 1.5em; font-weight: bold;">Click a column to sort.</p>
    <div id="mydata-btngroup">
      <button class="btn btn-primary" (click)="onClickFilter(0)">Filter only open</button>
      <button class="btn btn-primary" (click)="onClickFilter(1)">Filter only close</button>
      <button class="btn btn-primary" (click)="onClickFilter(2)">Filter both</button>
    </div>
    <hr>
    <div class="row">
      <div class="col-md-12">
        <div id="myTable"></div>
      </div>
    </div>
  `,

})
export class DataComponent implements OnInit {
  dataInfoJson: any = [];
  tableContainer: any;
  hot: any;
  hereObjList: Array<any>;
  hereObjListOriginal: Array<any>;
  hotSetting: any;
  hotSettingPreserved: any;

  myEventEmitter: any;
  bunchObser: any;

  currentFilterOption: number = 2;

  funcNewInSubs(data) {
    this.dataInfoJson = data;
    this.hereObjList=[];
    this.hereObjListOriginal=[];
    for(let i=0;i<this.dataInfoJson.length;i++) {
      let hereObj={}
      hereObj['open'] = this.dataInfoJson[i]['open'];
      hereObj['customerName'] = this.dataInfoJson[i]['customerName'];
      hereObj['cusEmail'] = this.dataInfoJson[i]['cusEmail'];
      hereObj['content'] = this.dataInfoJson[i]['content'];
      hereObj['period'] = this.dataInfoJson[i]['period'];
      hereObj['closedTimestamp'] = this.dataInfoJson[i]['closedTimestamp'];
      hereObj['employeeName'] = this.dataInfoJson[i]['employeeName'];
      let periodSplitted = hereObj['period'].split(' ');
      hereObj['period'] = periodSplitted[0] + ' / ' + periodSplitted[1] + ' / ' + periodSplitted[2];
      this.hereObjList.push(hereObj);
      this.hereObjListOriginal.push(Object.assign({}, hereObj));
    }
    this.tableContainer = document.getElementById('myTable');
    this.hotSetting = {
      readOnly: true,
      stretchH: 'all',
      data: this.hereObjList,
      colHeaders: ['Open or Close','CustomerName' ,'CustomerEmail','Content', 'OpenTimestamp', 'ClosedTimestamp', 'EmployeeName'],
      rowHeaders: true,
      columnSorting: true,
      sortIndicator: true
    };
    this.hot = new Handsontable(this.tableContainer,this.hotSetting);
  }

  funcUpdateInSubs(data) {
    if(JSON.stringify(this.dataInfoJson) !== JSON.stringify(data)) {
      this.dataInfoJson = data
      this.hereObjList=[];
      this.hereObjListOriginal=[];
      for(let i=0;i<this.dataInfoJson.length;i++) {
        let hereObj={}
        hereObj['open'] = this.dataInfoJson[i]['open'];
        hereObj['customerName'] = this.dataInfoJson[i]['customerName'];
        hereObj['cusEmail'] = this.dataInfoJson[i]['cusEmail'];
        hereObj['content'] = this.dataInfoJson[i]['content'];
        hereObj['period'] = this.dataInfoJson[i]['period'];
        hereObj['closedTimestamp'] = this.dataInfoJson[i]['closedTimestamp'];
        hereObj['employeeName'] = this.dataInfoJson[i]['employeeName'];
        let periodSplitted = hereObj['period'].split(' ');
        hereObj['period'] = periodSplitted[0] + ' / ' + periodSplitted[1] + ' / ' + periodSplitted[2];
        this.hereObjList.push(hereObj);
        this.hereObjListOriginal.push(Object.assign({}, hereObj));
      }
      this.hotSetting['data']=this.hereObjList;
      this.hot.updateSettings(this.hotSetting);
      this.hot.render();
    }
  }

  constructor(private _http: Http) { }

  ngOnInit(): any {

    var _this = this;
    document.addEventListener("click", function(){
      setTimeout(() => {

      }, 10);
    });

    this.myEventEmitter = new EventEmitter<any>();
    var source = Observable.fromEvent(
      this.myEventEmitter,
      'done');

    // read datainfo json.
    this._http.get('json/dataInfo.json')
      .map((res:Response) => res.json())
      .subscribe(
        data => this.funcNewInSubs(data),
        err => console.error(err)
      );
    this.bunchObser = Observable.interval(20000).takeUntil(source)
    .flatMap(() => {
      return this._http.get('json/dataInfo.json')
        .map((res:Response) => res.json());
    });
    this.bunchObser.subscribe(
      data => {
        this.funcUpdateInSubs(data);
      },
      err => console.error(err)
    );
  }

  ngOnDestroy(): any {
    this.myEventEmitter.emit('done');
  }

  onClickFilter(option: number):any {
    if(option===0) {
      this.hereObjList=this.hereObjListOriginal.filter(this.isitOpen);
      this.currentFilterOption=0;
    } else if (option===1) {
      this.hereObjList=this.hereObjListOriginal.filter(this.isitClose);
      this.currentFilterOption=1;
    } else {
      this.hereObjList=this.hereObjListOriginal;
      this.currentFilterOption=2;
    }
    this.hotSetting['data']=this.hereObjList;
    this.hot.updateSettings(this.hotSetting);
    this.hot.render();
  }

  private isitOpenOrClose(option: number, hObj: any): boolean {
    if(option===0) {
        if(hObj['open']==='open') {
          return true;
        } else return false;
    }
    else if (option===1) {
      if(hObj['open']==='closed') {
        return true;
      } else return false;
    }
  }
  private isitOpen = this.isitOpenOrClose.bind(null, 0);
  private isitClose = this.isitOpenOrClose.bind(null, 1);

}
