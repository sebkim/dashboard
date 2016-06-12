import {Component, OnInit} from '@angular/core';
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
      <div class="col-md-6">
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

  constructor(private _http: Http) { }

  ngOnInit(): any {
    // read datainfo json.
    this._http.get('json/dataInfo.json')
      .map((res:Response) => res.json())
      .subscribe(
        data => { this.dataInfoJson = data},
        err => console.error(err),
        () => {
          this.hereObjList=[];
          this.hereObjListOriginal=[];
          for(let i=0;i<this.dataInfoJson.length;i++) {
            let hereObj={}
            hereObj['open'] = this.dataInfoJson[i]['open'];
            hereObj['content'] = this.dataInfoJson[i]['content'];
            hereObj['period'] = this.dataInfoJson[i]['period'];
            let periodSplitted = hereObj['period'].split(' ');
            hereObj['period'] = periodSplitted[0] + ' / ' + periodSplitted[1];
            this.hereObjList.push(hereObj);
            this.hereObjListOriginal.push(Object.assign({}, hereObj));
          }
          this.tableContainer = document.getElementById('myTable');
          this.hotSetting = {
            readOnly: true,
            stretchH: 'all',
            data: this.hereObjList,
            colHeaders: ['Open or Close', 'Content', 'Year / Month'],
            rowHeaders: true,
            columnSorting: true,
            sortIndicator: true
          };
          this.hot = new Handsontable(this.tableContainer,this.hotSetting);
        } // end of ()=> {}
      );

  }

  onClickFilter(option: number):any {
    if(option===0) {
      this.hereObjList=this.hereObjListOriginal.filter(this.isitOpen);
    } else if (option===1) {
      this.hereObjList=this.hereObjListOriginal.filter(this.isitClose);
    } else {
      this.hereObjList=this.hereObjListOriginal;
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
