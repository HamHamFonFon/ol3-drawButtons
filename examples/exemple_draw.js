(function() {

    var zoomView = 15;

    // OpenStreetMap layer
    var osm = new ol.layer.Tile({
            title : 'OSM',
            visible : true,
            type: 'overlays',
            source: new ol.source.OSM()
        }
    );

    // Test edit layer
    var layer_test = new ol.layer.Vector({
        source: kuzzleSourceVector,
        title: key,
        type: 'base',
        visible: true,
    });

    var view = new ol.View({
        zoom: zoomView
    });

    // Map constructor
    var map = new ol.Map({
        layers: [osm, layer_test],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: ({
                collapsible: false
            })
        }).extend([
            new ol.control.ScaleLine(),
        ]),
        view: view
    });

    // Ajout des boutons de dessins
    var options = {
        "selectedLayer": layer_test,
        "popup_form" : true,
        "draw": {
            "Point": true,
            "LineString": true,
            "Square": true,
            "Circle": true,
            "Polygon": true
        }
    };
    var buttonsDrawControls = new ol.control.DrawButtons(options);
    buttonsDrawControls.setSelectedLayer(layer_test);
    map.addControl(buttonsDrawControls);
})();