/**
 * OpenLayers 3 Draw Control
 * @param ol.Vector.Layer selected_layer : layer
 * @param array opt_options : options
 * @constructor
 * @extends ol.control.Control
 *
 * Minify : wget --post-data="input=`cat ol3-drawbuttons.js`" --output-document=ol3-drawbuttons.min.js https://javascript-minifier.com/raw
 */
ol.control.DrawButtons = function (selected_layer, opt_options) {

    // Get options
    var options = opt_options || {};
    options.draw.Ending = true;

    // Set of defaultLayer
    this.selectedLayers = selected_layer;
    // Default values
    this.typeSelect = 'Point';
    this.map = this.getMap();
    this.flagDraw = new Boolean(false);
    this.flagLocStor = new Boolean(false);

    this.setFlagDraw(this.flagDraw);
    this.setFlagLocStor(this.flagLocStor);

    var this_ = this;

    // Set the selected layer : default layer or from localStorage
    this.setFlagLocStor(false);
    if (options.local_storage == true) {

        this.setFlagLocStor(true);
        if (localStorage.getItem('features') !== null) {

            // Create geojson features from local storage
            var featuresLS = new ol.format.GeoJSON().readFeatures(JSON.parse(localStorage.getItem('features')));

            var sourceLS =  new ol.source.Vector({
                features: featuresLS
            });
            this.selectedLayers.setSource(sourceLS);
        }
    }

    this.setSelectedLayer(this.selectedLayers);

    if (options.style_buttons == undefined) {
        options.style_buttons = "default";
    }

    // Not implemented yet
    if (options.popup_form == true) {
        this.popup = document.getElementById('popup');
    }

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
            divsChildren.item(i).classList.remove('progress');
            divsChildren.item(i).disabled = true;
        }

        // Disable Draws controls
        var divsChildren = this_.element.getElementsByClassName('div-draw')[0].children;
        for(var i = 0; i < divsChildren.length; i++) {
            divsChildren.item(i).classList.remove('enable');
            divsChildren.item(i).classList.remove('progress');
            divsChildren.item(i).disabled = true;

            if (divsChildren.item(i).type_control == 'ending') {
                divsChildren.item(i).classList.remove('hidden');
                divsChildren.item(i).disabled = false;
            }
        }

        // Enable the actual button
        e.target.classList.toggle('progress');

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
            divsChildren.item(i).classList.remove('progress');
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
            divsChildren.item(i).classList.remove('progress');
            divsChildren.item(i).disabled = true;
        }

        // Enable the actual button
        e.target.classList.toggle('progress');

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

        // Removing adding interaction
        if (undefined != this_.drawInteraction && this_.drawInteraction.getActive() == true) {
            this_.drawInteraction.setActive(false);
            this_.map.removeInteraction(this_.drawInteraction);
        }

        // Remove modify interaction
        if (undefined != this_.editSelectInteraction && this_.editSelectInteraction.getActive() == true) {
            this_.editSelectInteraction.setActive(false);
            this_.map.removeInteraction(this_.editSelectInteraction);
        }
        if (undefined != this_.delInteraction && this_.delInteraction.getActive()) {
            this_.delInteraction.setActive(false);
            this_.map.removeInteraction(this_.delInteraction);
        }
        if (undefined != this_.modifyInteraction && this_.modifyInteraction.getActive() == true) {
            this_.modifyInteraction.setActive(false);
            this_.map.removeInteraction(this_.modifyInteraction);
        }

        // Remove delete interaction
        if (undefined != this_.selectDelInteraction && this_.selectDelInteraction.getActive()) {
            this_.selectDelInteraction.setActive(false);
            this_.map.removeInteraction(this_.selectDelInteraction);
        }
        if (undefined != this_.delInteraction && this_.delInteraction.getActive()) {
            this_.delInteraction.setActive(false);
            this_.map.removeInteraction(this_.delInteraction);
        }

        if (true == this_.getFlagLocStor()) {
            this_.setFeaturesInLocalStorage();
        }

        this_.setFlagDraw(false); // Desactivation of drawing flag
        e.preventDefault();
    };


    // Marker
    var buttonPoint = this.buttonPoint = document.createElement('button');
    buttonPoint.setAttribute('title', 'Draw point');
    buttonPoint.id = buttonPoint.draw = 'Point';
    buttonPoint.type_control = 'draw';
    buttonPoint.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonPoint);

    // Line
    var buttonLine = this.buttonLine = document.createElement('button');
    buttonLine.setAttribute('title', 'Draw line');
    buttonLine.id = buttonLine.draw = 'LineString';
    buttonLine.type_control = 'draw';
    buttonLine.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonLine);

    // Square
    var buttonSquare = this.buttonCircle = document.createElement('button');
    buttonSquare.setAttribute('title', 'Draw square');
    buttonSquare.id = buttonSquare.draw = 'Square';
    buttonSquare.type_control = 'draw';
    buttonSquare.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonSquare);

    // Circle
    var buttonCircle = this.buttonCircle = document.createElement('button');
    buttonCircle.setAttribute('title', 'Draw circle');
    buttonCircle.id = buttonCircle.draw = 'Circle';
    buttonCircle.type_control = 'draw';
    buttonCircle.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonCircle);

    // Polygone
    var buttonPolygone = this.buttonPolygone = document.createElement('button');
    buttonPolygone.setAttribute('title', 'Draw polygone');
    buttonPolygone.id = buttonPolygone.draw = 'Polygon';
    buttonPolygone.type_control = 'draw';
    buttonPolygone.addEventListener('click', handleButtonsClick, false);
    elementDrawButtons.push(buttonPolygone);

    // Record add items
    var buttonDrawEnd = this.buttonDrawEnd = document.createElement('button');
    buttonDrawEnd.setAttribute('title', 'Ending draw mode');
    buttonDrawEnd.id = buttonDrawEnd.draw = 'Ending';
    buttonDrawEnd.type_control = 'ending';
    buttonDrawEnd.addEventListener('click', handleGroupEnd, false);
    buttonDrawEnd.removeEventListener('dblclick', handleGroupEnd);
    elementDrawButtons.push(buttonDrawEnd);

    // Edit
    var buttonEdit = this.buttonEdit = document.createElement('button');
    buttonEdit.setAttribute('title', 'Edit feature');
    buttonEdit.id = 'Edit';
    buttonEdit.type_control = 'edit';
    buttonEdit.addEventListener('click', handleControlsClick, false);
    elementDrawControls.push(buttonEdit);

    // Delete
    var buttonDel = this.buttonEdit = document.createElement('button');
    buttonDel.setAttribute('title', 'Delete feature');
    buttonDel.id = 'Delete';
    buttonDel.type_control = 'delete';
    buttonDel.addEventListener('click', handleControlsClick, false);
    elementDrawControls.push(buttonDel);

    var buttonControlEnd = this.buttonControlEnd = document.createElement('button');
    buttonControlEnd.setAttribute('title', 'Ending control mode');
    buttonControlEnd.id = 'Ending';
    buttonControlEnd.type_control = 'ending';
    buttonControlEnd.addEventListener('click', handleGroupEnd, false);
    buttonControlEnd.removeEventListener('dblclick', handleGroupEnd);
    elementDrawControls.push(buttonControlEnd);

    // /!\ if you want to use glyphicon, you must have Bootstrap
    if (options.style_buttons == "glyphicon") {
        buttonPoint.className = 'glyphicon glyphicon-map-marker';
        buttonLine.className = 'glyphicon icon-large icon-vector-path-line';
        buttonSquare.className = 'glyphicon icon-vector-path-square';
        buttonCircle.className = 'glyphicon icon-vector-path-circle';
        buttonPolygone.className = 'glyphicon icon-vector-path-polygon';
        buttonDrawEnd.className = 'glyphicon glyphicon-ok hidden';

        buttonEdit.className = 'glyphicon glyphicon-pencil';
        buttonDel.className = 'glyphicon glyphicon-trash';
        buttonControlEnd.className = 'glyphicon glyphicon-ok hidden';

    } else {
        buttonPoint.className = 'glyphicon-vector-path-point';
        buttonLine.className = 'glyphicon-vector-path-line';
        buttonSquare.className = 'glyphicon-vector-path-square';
        buttonCircle.className = 'glyphicon-vector-path-circle';
        buttonPolygone.className = 'glyphicon-vector-path-polygon';
        buttonDrawEnd.className = 'glyphicon-vector-path-ok hidden';

        buttonEdit.className = 'glyphicon-vector-path-pencil';
        buttonDel.className = 'glyphicon-vector-path-trash';
        buttonControlEnd.className = 'glyphicon-vector-path-ok hidden';
    }

    // Containers
    var divDraw = document.createElement('div');
    divDraw.className = 'div-draw ' + this.olGroupClassName;
    elementDrawButtons.forEach(function(button) {
        button.removeEventListener("dblclick", handleButtonsClick);
        if(options.draw[button.draw] == true) {
            divDraw.appendChild(button);
        }
    });

    var divControls = document.createElement('div');
    divControls.className = 'div-controls ' + this.olGroupClassName;
    elementDrawControls.forEach(function(button) {
        button.removeEventListener("dblclick", handleControlsClick);
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
            geometryFctDraw = this.geometryFctDraw = ol.interaction.Draw.createRegularPolygon(4);
        }

        // Draw new item
        var draw = this.drawInteraction = new ol.interaction.Draw({
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
 * Event listener call when a new feature is created
 * @param evt
 */
ol.control.DrawButtons.prototype.drawEndFeature = function(evt)
{
    var feature = evt.feature;
    var parser = new ol.format.GeoJSON();

    // Addind feature to source vector
    console.log("Add feature : " + feature.getGeometry().getCoordinates());

    // Problem with recuperation of a circle geometry : https://github.com/openlayers/ol3/pull/3434
    if ('Circle' == feature.type) {
        //var parserCircle = parser.writeCircleGeometry_()
    } else {
        var featureGeoJSON = parser.writeFeatureObject(feature);
    }
};

/**
 * Record features in local storage
 * /!\ circles can't ge parsing in GeoJSON : https://github.com/openlayers/ol3/pull/3434
 */
ol.control.DrawButtons.prototype.setFeaturesInLocalStorage = function()
{
    var features = this.getSelectedLayer().getSource().getFeatures();
    var parser = new ol.format.GeoJSON();

    if (features.length > 0) {
        var featuresGeoJson = parser.writeFeatures(features)
        localStorage.clear();
        console.log('Number of feature : ' + features.length);
        console.log(featuresGeoJson);
        localStorage.setItem('features', JSON.stringify(featuresGeoJson));
    }
}


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
        var editSelectInteraction = this.editSelectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click,
        });
        this.map.addInteraction(editSelectInteraction);

        // Gestion des event sur la feature
        editSelectInteraction.getFeatures().addEventListener('add', function (e) {
            var feature = e.element;
            feature.addEventListener('change', function(e) {
                console.log(feature.getGeometry());
            });
            console.log(feature.getGeometry());

            // ---------------------------------------------- //
            // Here, override for updating into your database //
            // ---------------------------------------------- //
        });

        // Modify interaction
        var mod = this.modifyInteraction = new ol.interaction.Modify({
            features: editSelectInteraction.getFeatures(),
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

        // TODO : set specific style on hover

        // Select Interaction
        var selectDelInteraction = this.selectDelInteraction = new ol.interaction.Select({
            condition: ol.events.condition.click,
            source : function(layer) {
                if (layer == this.getSelectedLayer()) {
                    return layer
                }
            }
        });
        this.map.addInteraction(selectDelInteraction);

        var this_ = this;
        selectDelInteraction.getFeatures().addEventListener('add', function(e) {
            var feature = e.element;
            if(confirm('Are you sure you want to delete this feature ?')) {
                try {
                    // Remove from interaction
                    selectDelInteraction.getFeatures().remove(feature);

                    // remove from selected Layer
                    this_.getSelectedLayer().getSource().removeFeature(feature);
                } catch (e) {
                    console.log(e.message);
                }
                // ---------------------------------------------- //
                // Here, override for deleting from your database //
                // ---------------------------------------------- //
            }
            e.preventDefault();
        });

        var delInteraction = this.delInteraction = new ol.interaction.Modify({
            style: this.styleEdit(),
            features: selectDelInteraction.getFeatures(),
            deleteCondition: function(event) {
                return ol.events.condition.singleClick(event);
            }
        });
        // add it to the map
        this.map.addInteraction(delInteraction);
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


/**
 * Getters/setters of selected layer : Set your layer according to your need :)
 * @param layer
 */
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
ol.control.DrawButtons.prototype.setFlagDraw = function(/** @type {boolean} */flagDraw)
{
    this.flagDraw = flagDraw;
};

ol.control.DrawButtons.prototype.getFlagDraw = function()
{
    return this.flagDraw;
};

/**
 * Flag for local storage
 * @param locStor
 */
ol.control.DrawButtons.prototype.setFlagLocStor = function(/** @type {boolean} */locStor)
{
    this.flagLocStor = locStor;
};

ol.control.DrawButtons.prototype.getFlagLocStor = function()
{
    return this.flagLocStor;
};