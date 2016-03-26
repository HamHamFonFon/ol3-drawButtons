/**
 * OpenLayers 3 Draw Control
 * @param ol.Vector.Layer selected_layer : layer
 * @param array opt_options : options
 * @constructor
 * @extends ol.control.Control
 *
 * Minify : wget --post-data="input=`cat ol3-drawbuttons.js`" --output-document=ol3-drawbuttons.min.js https://javascript-minifier.com/raw
 */

ol.control.ControlDrawButtons = function (selected_layer, opt_options) {

    //require('ol3-drawbuttons.js');

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

    var buttonsContainer = new ol3buttons.init(opt_options, handleButtonsClick, handleControlsClick, handleGroupEnd);

    ol.control.Control.call(this, {
        element: buttonsContainer,
        target: options.target
    });
};

ol.inherits(ol.control.ControlDrawButtons, ol.control.Control);

/**
 * Drawing on map
 * @param evt
 */
ol.control.ControlDrawButtons.prototype.drawOnMap = function(evt)
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
ol.control.ControlDrawButtons.prototype.drawEndFeature = function(evt)
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
ol.control.ControlDrawButtons.prototype.setFeaturesInLocalStorage = function()
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
ol.control.ControlDrawButtons.prototype.controlEditOnMap = function(evt) {
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
ol.control.ControlDrawButtons.prototype.controlDelOnMap = function (evt)
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
ol.control.ControlDrawButtons.prototype.styleAdd = function()
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

ol.control.ControlDrawButtons.prototype.styleEdit = function()
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
ol.control.ControlDrawButtons.prototype.setSelectedLayer = function(layer)
{
    this.selectedLayers = layer;
};

ol.control.ControlDrawButtons.prototype.getSelectedLayer = function()
{
    return this.selectedLayers;
};

/**
 * Add a flag if Mode draw or not
 * @param flagDraw
 */
ol.control.ControlDrawButtons.prototype.setFlagDraw = function(/** @type {boolean} */flagDraw)
{
    this.flagDraw = flagDraw;
};

ol.control.ControlDrawButtons.prototype.getFlagDraw = function()
{
    return this.flagDraw;
};

/**
 * Flag for local storage
 * @param locStor
 */
ol.control.ControlDrawButtons.prototype.setFlagLocStor = function(/** @type {boolean} */locStor)
{
    this.flagLocStor = locStor;
};

ol.control.ControlDrawButtons.prototype.getFlagLocStor = function()
{
    return this.flagLocStor;
};