(function() {

    var zoomView = 5;

    // OpenStreetMap layer
    var base_layer = new ol.layer.Tile({
            title: 'Satellite',
            type: 'base',
            source: new ol.source.MapQuest(
                {layer: 'sat'}
            )
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
        zoom: zoomView,
        center: ol.proj.transform([2.21, 46.23], 'EPSG:4326', 'EPSG:3857'),
    });

    // Map constructor
    var map = new ol.Map({
        layers: [base_layer, vector_draw],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: ({
                collapsible: false
            })
        }),

        view: view
    });

    // Adding draw controls
    var options = {
        "style_buttons" : null, /** @var {string} glyphicon|default */
        "draw": {
            "Point": true,
            "LineString": true,
            "Square": true,
            "Circle": true,
            "Polygon": true
        }
    };
    var buttonsDrawControls = new ol.control.ControlDrawButtons(vector_draw, options);
    map.addControl(buttonsDrawControls);

})();