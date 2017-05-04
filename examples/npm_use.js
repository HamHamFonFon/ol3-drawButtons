var ol = require('openlayers');
var drawFeature = require('ol3-draw-features');

// Base layer : Open Street map
var baseLayer = new ol.layer.Base({
    source : new ol.source.OSM(),
    visible: true
});

// Layer draw
var drawLayer = new ol.layer.Vector({
    source: new ol.source.Vector(),
    visible: true
});

// Map
var map = new ol.Map({
    target: 'map',
    layers:[
        baseLayer, drawLayer
    ],
    views: new ol.View({
        center: new ol.proj.transform([2.33, 48.86], 'EPSG:4326', 'EPSG:3857'),
        zoom: 5
    })
});

// Add control
var options = {
    "draw": {
        "Point": true,
        "LineString": true,
        "Square": true,
        "Circle": true,
        "Polygon": true
    }
};
var buttonsDraw = new drawFeature(drawLayer, options);
map.addControl(buttonsDraw);