import {Component, OnInit} from '@angular/core';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {ROUTER_DIRECTIVES, RouteConfig} from '@angular/router-deprecated';

import {GeoComponent} from './geo.component';
import {KeyComponent} from './key.component';
import {DataComponent} from './data.component';

@Component({
  selector: 'my-app',
  templateUrl: 'templates/app.tpl.html',
  directives: [DROPDOWN_DIRECTIVES, ROUTER_DIRECTIVES],
})
@RouteConfig([
    {path: '/geo', name: 'Geo', component: GeoComponent, useAsDefault: true},
    {path: '/key', name: 'Key', component: KeyComponent},
    {path: '/data', name: 'Data', component: DataComponent},
])
export class AppComponent implements OnInit {
  // Geospatial, Key Metrics, Data
  boardNames: Array<string> = ["Geospatial", "Key Metrics", "Data"];
  boardName: string = this.boardNames[0];

  whichActive: number = 0;
  changeActive(ind: number) {
    this.whichActive = ind;
    this.boardName = this.boardNames[ind];
    console.log(this.boardName);
  }

  ngOnInit(): any {

  }
}
