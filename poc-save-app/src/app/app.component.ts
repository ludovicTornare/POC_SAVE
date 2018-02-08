import {Component, OnInit} from '@angular/core';

var ol = window['ol'];
var ga =  window['ga'];
var $ =  window['$'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  map: any;
  olSource: any;
  vectorLayer: any;

  ngOnInit(){
   this.initMap();
   this.olSource = new ol.source.Vector();
   this.vectorLayer = new ol.layer.Vector({
      source: this.olSource
   });
   console.log('init');
  }

  hasVectorOnMap = function() {
    if (this.map.getLayers().getArray().length > 1) {
      return true;
    }
  };

  geojsonFormat = new ol.format.GeoJSON();

  // Load and apply GeoJSON file function
  setLayerSource = function() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: '//api3.geo.admin.ch/examples/geojson_example.json',
      success: function(data) {
        that.olSource.clear();
        console.log(data)
        that.olSource.addFeatures(
          that.geojsonFormat.readFeatures(data)
        );
      },
      error: function() {
        that.olSource.clear();
      }
    });
  };

// Load and apply styling file function
  setLayerStyle = function() {
    var that = this;
    $.ajax({
      type: 'GET',
      url: '//api3.geo.admin.ch/examples/geojson_style_example.json',
      success: function(data) {
        console.log(data)
        var olStyleForVector = new ga.style.StylesFromLiterals(data);
        that.vectorLayer.setStyle(function(feature) {
          return [olStyleForVector.getFeatureStyle(feature)];
        });
      },
      error: function() {
      }
    });
  };

  applyGeojsonConfig = function() {

    // Load Styling file
    this.setLayerStyle();

    // Load Geojson file
    this.setLayerSource();

    // Only one vector layer is added
    if (this.hasVectorOnMap()) {
      this.map.removeLayer(this.vectorLayer);
    }
    // Add Geojson layer
    this.map.addLayer(this.vectorLayer);

  }

  initMap(){
    var layer = ga.layer.create('ch.swisstopo.pixelkarte-farbe');
    this.map = new ga.Map({
      target: 'map',
      view: new ol.View({
        resolution: 500,
        center: [2670000, 1160000]
      })
    });
    this.map.addLayer(layer);

  }

}
