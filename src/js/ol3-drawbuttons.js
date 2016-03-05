/**
 * OpenLayers 3 Draw Control
 * @param opt_options
 * @constructor
 * @extends ol.control.Control
 */
ol.control.DrawButtons = function (opt_options) {

    // Get options
    var options = opt_options || {};
    options.draw.Ending = true;

    this.selectedLayers = options.selectedLayer;
    var this_ = this;

    if (options.popup_form == true) {
        this.popup = document.getElementById('popup');
    }

    // Default values
    this.typeSelect = 'Point';
    this.map = this.getMap();
    this.flagDraw = new Boolean(false);
    this.setFlagDraw(this.flagDraw);

    // Classes CSS
    this.olClassName = 'ol-unselectable ol-control';
    this.drawContainer = 'toggle-control';

    this.drawClassName = this.olClassName + ' ' + this.drawContainer;

    this.olGroupClassName = 'ol-control-group';

    // Boutons
    var elementDrawButtons = new ol.Collection();
    var elementDrawControls = new ol.Collection();

    // Events listeners
    var handleButtonsClick = function (e)
    {
        e = e || window.event;

        // Disabled Controls buttons
        var divsChildren = this_.element.getElementsByClassName('div-controls')[0].children;
        for(var i = 0; i < divsChildren.length; i++) {
            divsChildren.item(i).classList.remove('enable');
            divsChildren.item(i).disabled = true;
        }

        // Disable Draws controls
        var divsChildren = this_.element.getElementsByClassName('div-draw')[0].children;
        for(var i = 0; i < divsChildren.length; i++) {
            divsChildren.item(i).classList.remove('enable');
            divsChildren.item(i).disabled = true;

            if (divsChildren.item(i).type_control == 'ending') {
                divsChildren.item(i).classList.remove('hidden');
                divsChildren.item(i).disabled = false;
            }
        }

        // Enable the actual button
        e.target.classList.toggle('enable');
        e.target.disabled = false;

        this_.drawOnMap(e);

        e.preventDefault();
    };

    // handling control mode
    var handleControlsClick = function (e)
    {
        e = e || window.event;

        // Disabled Controls buttons
        var divsChildren = this_.element.getElementsByClassName('div-controls')[0].children;
        for(var i = 0; i < divsChildren.length; i++) {
            divsChildren.item(i).classList.remove('enable');
            divsChildren.item(i).disabled = true;

            if (divsChildren.item(i).type_control == 'ending') {
                divsChildren.item(i).classList.remove('hidden');
                divsChildren.item(i).disabled = false;
            }
        }

        // Disable Draws controls
        var divsChildren = this_.element.getElementsByClassName('div-draw')[0].children;
        for(var i = 0; i < divsChildren.length; i++) {
            divsChildren.item(i).classList.remove('enable');
            divsChildren.item(i).disabled = true;
        }

        // Enable the actual button
        e.target.classList.toggle('enable');
        e.target.disabled = false;

        switch (e.target.type_control) {
            case 'edit' :
                this_.controlEditOnMap(e);
                break;
            case 'delete' :
                this_.controlDelOnMap(e);
                break;
        }

        e.preventDefault();
    };


    // Endind draw/control mode
    var handleGroupEnd = function (e)
    {
        var divsChildren = this_.element.querySelectorAll('.div-controls button, .div-draw button');
        for(var i = 0; i < divsChildren.length; i++) {
            divsChildren.item(i).disabled = false;

            if (divsChildren.item(i).type_control == 'ending') {
                if (!divsChildren.item(i).classList.contains('hidden')) {
                    divsChildren.item(i).classList.toggle('hidden');
                }
            }
        }

        // Removing interaction
        this_.map.removeInteraction(this_.draw);
        this_.setFlagDraw(false); // Desactivation of drawing flag
        e.preventDefault();
    };


    // Marker
    var buttonPoint = this.buttonPoint = document.createElement('button');
    buttonPoint.setAttribute('title', 'Draw point');
    buttonPoint.id = buttonPoint.draw = 'Point';
    buttonPoint.type_control = 'draw';
    buttonPoint.className = 'glyphicon glyphicon-map-marker';
    buttonPoint.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonPoint);

    // Line
    var buttonLine = this.buttonLine = document.createElement('button');
    buttonLine.setAttribute('title', 'Draw line');
    buttonLine.id = buttonLine.draw = 'LineString';
    buttonLine.type_control = 'draw';
    buttonLine.className = 'glyphicon glyphicon-vector-path-line';
    buttonLine.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonLine);

    // Square
    var buttonSquare = this.buttonCircle = document.createElement('button');
    buttonSquare.setAttribute('title', 'Draw square');
    buttonSquare.id = buttonSquare.draw = 'Square';
    buttonSquare.type_control = 'draw';
    buttonSquare.className = 'glyphicon glyphicon-vector-path-square';
    buttonSquare.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonSquare);

    // Circle
    var buttonCircle = this.buttonCircle = document.createElement('button');
    buttonCircle.setAttribute('title', 'Draw circle');
    buttonCircle.id = buttonCircle.draw = 'Circle';
    buttonCircle.type_control = 'draw';
    buttonCircle.className = 'glyphicon glyphicon-vector-path-circle';
    buttonCircle.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonCircle);

    // Polygone
    var buttonPolygone = this.buttonPolygone = document.createElement('button');
    buttonPolygone.setAttribute('title', 'Draw polygone');
    buttonPolygone.id = buttonPolygone.draw = 'Polygon';
    buttonPolygone.type_control = 'draw';
    buttonPolygone.className = 'glyphicon glyphicon-vector-path-polygon';
    buttonPolygone.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonPolygone);

    // Record add items
    var buttonDrawEnd = this.buttonDrawEnd = document.createElement('button');
    buttonDrawEnd.setAttribute('title', 'Ending draw mode');
    buttonDrawEnd.id = buttonDrawEnd.draw = 'Ending';
    buttonDrawEnd.type_control = 'ending';
    buttonDrawEnd.className = 'glyphicon glyphicon-ok hidden';
    buttonDrawEnd.addEventListener('click', handleGroupEnd, false);
    elementDrawButtons.push(buttonDrawEnd);


    // Edit
    var buttonEdit = this.buttonEdit = document.createElement('button');
    buttonEdit.setAttribute('title', 'Edit feature');
    buttonEdit.id = 'Edit';
    buttonEdit.type_control = 'edit';
    buttonEdit.className = 'glyphicon glyphicon glyphicon-pencil';
    buttonEdit.addEventListener('click', handleControlsClick, false);
    elementDrawControls.push(buttonEdit);

    // Delete
    var buttonDel = this.buttonEdit = document.createElement('button');
    buttonDel.setAttribute('title', 'Delete feature');
    buttonDel.id = 'Delete';
    buttonDel.type_control = 'delete';
    buttonDel.className = 'glyphicon glyphicon glyphicon-trash';
    buttonDel.addEventListener('click', handleControlsClick, false);
    elementDrawControls.push(buttonDel);

    var buttonControlEnd = this.buttonControlEnd = document.createElement('button');
    buttonControlEnd.setAttribute('title', 'Ending control mode');
    buttonControlEnd.id = 'Ending';
    buttonControlEnd.type_control = 'ending';
    buttonControlEnd.className = 'glyphicon glyphicon-ok hidden';
    buttonControlEnd.addEventListener('click', handleGroupEnd, false);
    elementDrawControls.push(buttonControlEnd);

    // Containers
    var divDraw = document.createElement('div');
    divDraw.className = 'div-draw ' + this.olGroupClassName;
    elementDrawButtons.forEach(function(button) {
        if(options.draw[button.draw] == true) {
            divDraw.appendChild(button);
        }
    });

    var divControls = document.createElement('div');
    divControls.className = 'div-controls ' + this.olGroupClassName;
    elementDrawControls.forEach(function(button) {
        divControls.appendChild(button);
    });

    // Container
    var element = document.createElement('div');
    element.className = this.drawClassName;
    element.appendChild(divDraw);
    element.appendChild(divControls);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });
};

ol.inherits(ol.control.DrawButtons, ol.control.Control);

/**
 * Drawing on map
 * @param evt
 */
ol.control.DrawButtons.prototype.drawOnMap = function(evt)
{
    this.map = this.getMap();

    if (!this.getSelectedLayer()) {
        this.setFlagDraw(false);
    } else {
        this.setFlagDraw(true)
    }

    if (this.getFlagDraw() == true) {
        var geometryFctDraw;
        var typeSelect = evt.target.draw;

        // Specific for square
        if (typeSelect == 'Square') {
            typeSelect = 'Circle';
            geometryFctDraw = ol.interaction.Draw.createRegularPolygon(4);
        }

        // Draw new item
        var draw = this.draw = new ol.interaction.Draw({
            //features: features,
            source : this.getSelectedLayer().getSource(),
            features : new ol.Collection(),
            type: /** @type {ol.geom.GeometryType} */ (typeSelect),
            geometryFunction : geometryFctDraw,
            style : this.styleAdd()
        });

        draw.on('drawend', this.drawEndFeature, this);

        this.map.addInteraction(draw);
    }

};


/**
 * Edit or delete a feature
 * @param evt
 */
ol.control.DrawButtons.prototype.controlEditOnMap = function(evt) {
    if (!this.getSelectedLayer()) {
        this.setFlagDraw(false)
    } else {
        this.setFlagDraw(true);
    }

    if (this.getFlagDraw() == true) {
        this.map = this.getMap();

        // Select Interaction
        var selectedLayer = this.getSelectedLayer();
        var selectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click,
        });
        this.map.addInteraction(selectInteraction);

        // Gestion des event sur la feature
        selectInteraction.getFeatures().addEventListener('add', function (e) {
            var feature = e.element;
            feature.addEventListener('change', function(e) {
                console.log(feature.getGeometry());
            });
            console.log(feature.getGeometry());
        });

        // Modify interaction
        var mod = new ol.interaction.Modify({
            features: selectInteraction.getFeatures(),
            style: this.styleEdit()
        });
        this.map.addInteraction(mod);
    }
};

/**
 * Delete a feature from map
 * @param evt
 */
ol.control.DrawButtons.prototype.controlDelOnMap = function (evt)
{
    if (!this.getSelectedLayer()) {
        this.setFlagDraw(false)
    } else {
        this.setFlagDraw(true);
    }

    if (this.getFlagDraw() == true) {
        this.map = this.getMap();

        // Select Interaction
        var selectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click,
            source : function(layer) {
                if (layer == this.getSelectedLayer()) {
                    return layer
                }
            }
        });
        var this_ = this;
        selectInteraction.getFeatures().addEventListener('add', function(e) {
            var feature = e.element;
            if(confirm('Are you sure you want to delete this feature ?')) {
                // remove from selected Layer
                this_.getSelectedLayer().getSource().removeFeature(feature);

                // Here, override for deleting from your database

            } else {
                selectInteraction.getFeatures().remove(feature);
            }
            e.preventDefault();
        });

        this.map.addInteraction(selectInteraction);
    }
};

/**
 * Styles of selected layer
 */
ol.control.DrawButtons.prototype.styleAdd = function()
{
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [69, 175, 157, 0.4] //#45B29D
        }),
        stroke: new ol.style.Stroke({
            color: [0, 75, 82, 0.75], //#004B52
            width: 1.5
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: [60, 255, 100, 0.4]
            }),
            stroke: new ol.style.Stroke({
                color: [255, 255, 255, 0.75],
                width: 1.5
            })
        }),
        zIndex: 100000
    });

    return style;
};

ol.control.DrawButtons.prototype.styleEdit = function()
{
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: [4, 100, 128, 0.4] //#046380
        }),
        stroke: new ol.style.Stroke({
            color: [0, 64, 28, 0.75], //#004080
            width: 1.5
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: [4, 100, 128, 0.4]
            }),
            stroke: new ol.style.Stroke({
                color: [0, 64, 28, 0.75],
                width: 1.5
            })
        }),
        zIndex: 100000
    });
    return style;
};


// Endind drawing feature
ol.control.DrawButtons.prototype.drawEndFeature = function(evt)
{
    var feature = evt.feature;
    var parser = new ol.format.GeoJSON();

    // Problem with recuperation of a circle geometry : https://github.com/openlayers/ol3/pull/3434
    if ('Circle' == feature.type) {
        //var parserCircle = parser.writeCircleGeometry_()
    } else {
        var featureGeoJSON = parser.writeFeatureObject(feature);
    }

    //console.log(feature.getGeometry().getCoordinates());
    console.log(featureGeoJSON);
};


// Getters/setters of selected layer :
// Set your layer according to your need :)
ol.control.DrawButtons.prototype.setSelectedLayer = function(layer)
{
    this.selectedLayers = layer;
};

ol.control.DrawButtons.prototype.getSelectedLayer = function()
{
    return this.selectedLayers;
};

/**
 * Add a flag if Mode draw or not
 * @param flagDraw
 */
ol.control.DrawButtons.prototype.setFlagDraw = function(/** @type boolean} */flagDraw)
{
    this.flagDraw = flagDraw;
};

ol.control.DrawButtons.prototype.getFlagDraw = function()
{
    return this.flagDraw;
};