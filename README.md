# Dashboard frontend

This app is a corporate dashboard. It reads json format data file. JSON file includes geospatial info, key metric info, and issue data. Geospatial view uses google map API. When a user click company name, the app opens the info window for that company. Key Metric view shows a line chart, and a bar chart. Data view shows all open and closed issues. In this view, each column is sortable. Also, the app provides filter function for showing whether only open or close or both.

It is developed under Version 53.0.2751.0 canary (64-bit).

## Usage

* `npm install` (to install required node packages.)
* `npm run start` (it concurrently runs lite-server and gulp default. gulp default watches modification of dev files, if something is modified, compile those.)
