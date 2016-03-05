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
    var vector_draw = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    var view = new ol.View({
        zoom: zoomView
    });

    // Map constructor
    var map = new ol.Map({
        layers: [osm],
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
        "selectedLayer": vector_draw,
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
    buttonsDrawControls.setSelectedLayer(vector_draw);
    map.addControl(buttonsDrawControls);

})();