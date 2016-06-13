import {Component, OnInit} from '@angular/core';
import {Http, Response} from '@angular/http';
// import 'rxjs/Rx';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'my-geo',
  directives: [],
  // templateUrl: 'templates/app.tpl.html'
  template: `
  <p style="font-size: 1.5em; font-weight: bold;">Click a company name to see the detail.</p>
  <ul id="compNameMenu">
    <li *ngFor="let eachComp of companyNameList; let i = index">
      <a (click)="onCompNameMenuClick(i)">{{eachComp}}</a>
    </li>
  </ul>
  <div id="map"></div>
  `,
  styles: ['#map {height: 80%; margin-right: 2em; } html,body {height: 100%;} ']

})
export class GeoComponent implements OnInit {

  geoInfoJson:any = [];
  companyNameList: any = [];
  companyLatLngList: any = [];
  // companyDescList: any = [];
  // companyEmpNumList: any = [];

  gMap: any;
  gInfowindowList: any = [];
  gMarkerList: any = [];

  constructor(private _http: Http) { }

  funcInSubs(data) {
    this.geoInfoJson = data;
    this.companyNameList = [];
    this.companyLatLngList = [];
    this.gInfowindowList = [];
    this.gMarkerList = [];
    // init google map
    var orlando = {lat: 28.538336, lng: -81.379234};
    this.gMap = new google.maps.Map(document.getElementById('map'), {
      zoom: 6,
      center: orlando
    });

    for(let i=0; i<this.geoInfoJson.length;i++) {
      this.companyNameList.push(this.geoInfoJson[i].compName);
      // this.companyEmpNumList.push(this.geoInfoJson[i].numberOfEmp);
      // this.companyDescList.push(this.geoInfoJson[i].compDescription);

      let hereObj={};
      hereObj['lat'] = this.geoInfoJson[i].lat;
      hereObj['lng'] = this.geoInfoJson[i].lng;
      this.companyLatLngList.push(hereObj);

      let contentString: string;
      contentString = sprintf(`
        <h1>Company Name: %s</h1>
        <h3>Number of Employees: %s</h3>
        <br>
        <p>Company Description: <br>%s</p>
        `,
        this.geoInfoJson[i].compName, this.geoInfoJson[i].numberOfEmp,
        this.geoInfoJson[i].compDescription);

      this.gInfowindowList.push (new google.maps.InfoWindow({
        content: contentString
      }));

      this.gMarkerList.push (new google.maps.Marker({
        position: hereObj,
        map: this.gMap,
        title: this.geoInfoJson[i].compName
      }));
    }
  }

  ngOnInit():any {
    // read json.
    this._http.get('json/geoInfo.json')
    .map((res:Response) => res.json())
    .subscribe(
        data => this.funcInSubs(data),
        err => console.error(err)
    );

    // let bunchObser = Observable.interval(10000)
    // .flatMap(() => {
    //   return this._http.get('json/geoInfo.json').map((res:Response) => res.json());
    // });
    // bunchObser.subscribe(
    //   data => {
    //     this.funcInSubs(data);
    //   },
    //   err => console.error(err)
    // );
  }

  onCompNameMenuClick(ind: number): any {
    this.gMap.setCenter(this.companyLatLngList[ind]);
    this.gMap.setZoom(8);
    for(let i=0; i<this.geoInfoJson.length; i++) {
        this.gInfowindowList[i].close();
    }
    this.gInfowindowList[ind].open(this.gMap, this.gMarkerList[ind]);
  }

}
