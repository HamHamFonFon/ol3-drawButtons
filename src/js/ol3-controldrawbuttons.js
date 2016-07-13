//import ol from 'openlayers';
/**
 * OpenLayers 3 Draw Control
 * @param ol.Vector.Layer selected_layer : layer
 * @param array opt_options : options
 * @constructor
 * @extends ol.control.Control
 *
 */
ol.control.ControlDrawButtons = function (selected_layer, opt_options) {

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

    if (undefined != options.properties)
    {
        this.element = options.properties.element;
    }

    this.setFlagDraw(this.flagDraw);
    this.setFlagLocStor(this.flagLocStor);

    var this_ = this;

    // Set the selected layer : default layer or from localStorage
    this.setFlagLocStor(false);
    if (options.local_storage == true) {

        this.setFlagLocStor(true);
        if (localStorage.getItem('features') !== null) {

            // Create geojson features from local storage
            console.log(localStorage.getItem('features'))
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
        if (undefined != this_.drawInteraction /*&& this_.drawInteraction.getActive() == true*/) {
            //this_.drawInteraction.setActive(false);
            this_.map.removeInteraction(this_.drawInteraction);
            this_.drawInteraction = null;
        }

        // Remove selection interaction and modify interaction
        if (undefined != this_.editSelectInteraction /*&& this_.editSelectInteraction.getActive() == true*/) {
            //this_.editSelectInteraction.setActive(false);
            this_.map.removeInteraction(this_.editSelectInteraction);
            this_.editSelectInteraction = null;
        }

        if (undefined != this_.modifyInteraction /*&& this_.modifyInteraction.getActive() == true*/) {
            //this_.modifyInteraction.setActive(false);
            this_.map.removeInteraction(this_.modifyInteraction);
            this_.modifyInteraction = null;
        }

        // Remove delete interaction
        if (undefined != this_.selectDelInteraction /*&& this_.selectDelInteraction.getActive()*/) {
            //this_.selectDelInteraction.setActive(false);
            this_.map.removeInteraction(this_.selectDelInteraction);
        }
        if (undefined != this_.delInteraction /*&& this_.delInteraction.getActive()*/) {
            //this_.delInteraction.setActive(false);
            this_.map.removeInteraction(this_.delInteraction);
			this_.delInteraction = null;
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
    var this_ = this;
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

        // Source and vector temporar for drawing : http://jsfiddle.net/jp4dojwu/
        this.tmpVectorSource = new ol.source.Vector();
        this.tmpVectorLayer = new ol.layer.Vector({source:this.tmpVectorSource});

        // Draw new item
        var draw = this.drawInteraction = new ol.interaction.Draw({
            //features: features,
            source : this.tmpVectorSource, //this.getSelectedLayer().getSource(),
            features : new ol.Collection(),
            type: /** @type {ol.geom.GeometryType} */ (typeSelect),
            geometryFunction : geometryFctDraw,
            style : this.styleAdd()
        });

        this.drawInteraction.on('drawstart', function() {
            this_.tmpVectorSource.clear();
        }, this);
        this.drawInteraction.on('drawend', this.drawEndFeature, this);
        this.map.addInteraction(this.drawInteraction);
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

    // Problem with recuperation of a circle geometry : https://github.com/openlayers/ol3/pull/3434
    if ('Circle' == feature.getGeometry().getType()) {
        //var parserCircle = parser.writeCircleGeometry_()
    } else {
        // Addind feature to source vector
        console.log("Add feature : " + feature.getGeometry().getCoordinates());
        var featureGeoJSON = parser.writeFeatureObject(feature);

        if (undefined != this.element) {
            var properties = feature.getProperties();
            this.element.appendChild(this.formulary(properties));
        }
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
            condition: ol.events.condition.singleClick,
            source : function(layer) {
                if (layer == this.getSelectedLayer()) {
                    return layer
                }
            }
        });
        this.map.addInteraction(editSelectInteraction);

        // Modify interaction
        var mod = this.modifyInteraction = new ol.interaction.Modify({
            features: editSelectInteraction.getFeatures(),
            style: this.styleEdit(),
            zIndex: 50
        });
        mod.on('modifyend', this.editEndFeature, this);

        this.map.addInteraction(mod);
    }
};

/**geometryFctDraw
 * @param evt
 */
ol.control.ControlDrawButtons.prototype.editEndFeature = function(evt)
{
    var features = evt.features.getArray();

    // Dont use ES2015 syntax "array.forEach(feature => { return feature; })"
    features.forEach(function(feature, index) {
        // Problem with recuperation of a circle geometry : https://github.com/openlayers/ol3/pull/3434
        if ('Circle' == feature.getGeometry().getType()) {
            //var parserCircle = parser.writeCircleGeometry_()
        } else {
            // Edit document in Kuzzle
            dataLayers.updateGeodatasDocument(feature);
        }
    });
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
                if (undefined != feature) {
                    // Remove from interaction
                    var featureId = feature.getId();
                    selectDelInteraction.getFeatures().remove(feature);
                   
				// ---------------------------------------------- //
                // Here, override for deleting from your database //
                // ---------------------------------------------- //

                } else {
                    
                }
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


/**
 *
 * @type {{tabOptions: {}, olClassName: string, drawContainer: string, olGroupClassName: string, handleButtonsClick: null, handleControlsClick: null, handleGroupEnd: null, init: ol3buttons.init, elContainer: ol3buttons.elContainer, drawButtons: ol3buttons.drawButtons, drawControls: ol3buttons.drawControls}}
 */
var ol3buttons = {

    tabOptions: {},
    olClassName: 'ol-unselectable ol-control',
    drawContainer: 'toggle-control',
    olGroupClassName: 'ol-control-group',
    handleButtonsClick: null,
    handleControlsClick: null,
    handleGroupEnd: null,

    init: function (tabOptions, handleButtonsClick, handleControlsClick, handleGroupEnd)
    {
        var this_ = this;
        this.tabOptions = ol3buttons.tabOptions = tabOptions;

        // Classes CSS
        this.olClassName = ol3buttons.olClassName;
        this.drawContainer = ol3buttons.drawContainer;
        this.olGroupClassName = ol3buttons.olGroupClassName;
        this.drawClassName = this.olClassName + ' ' + this.drawContainer;

        // Callback TEST
        this.handleButtonsClick = ol3buttons.handleButtonsClick = handleButtonsClick;
        this.handleControlsClick = ol3buttons.handleControlsClick = handleControlsClick;
        this.handleGroupEnd = ol3buttons.handleGroupEnd = handleGroupEnd;

        var container = ol3buttons.elContainer();
        container.className = this.drawClassName;
        return container;
    },

    /**
     * Create container
     */
    elContainer: function ()
    {
        var this_ = this;
        // Containers
        var elementDrawButtons = this.drawButtons();
        var divDraw = document.createElement('div');
        divDraw.className = 'div-draw ' + this.olGroupClassName;

        elementDrawButtons.forEach(function(button) {
            button.removeEventListener("dblclick", this_.handleButtonsClick);
            if(this_.tabOptions.draw[button.draw] == true) {
                divDraw.appendChild(button);
            }
        });

        var elementDrawControls = this.drawControls();
        var divControls = document.createElement('div');
        divControls.className = 'div-controls ' + this.olGroupClassName;
        elementDrawControls.forEach(function(button) {
            button.removeEventListener("dblclick", this_.handleControlsClick);
            divControls.appendChild(button);
        });

        // Container
        var elementContainer = document.createElement('div');
        elementContainer.appendChild(divDraw);
        elementContainer.appendChild(divControls);

        return elementContainer;
    },

    /**
     * buttons for drawing
     */
    drawButtons: function()
    {
        var elementDrawButtons = new ol.Collection();

        // Marker
        var buttonPoint = this.buttonPoint = document.createElement('button');
        buttonPoint.setAttribute('title', 'Draw point');
        buttonPoint.id = buttonPoint.draw = 'Point';
        buttonPoint.type_control = 'draw';
        buttonPoint.addEventListener('click', this.handleButtonsClick, false);
        elementDrawButtons.push(buttonPoint);

        // Line
        var buttonLine = this.buttonLine = document.createElement('button');
        buttonLine.setAttribute('title', 'Draw line');
        buttonLine.id = buttonLine.draw = 'LineString';
        buttonLine.type_control = 'draw';
        buttonLine.addEventListener('click', this.handleButtonsClick, false);
        elementDrawButtons.push(buttonLine);

        // Square
        var buttonSquare = this.buttonCircle = document.createElement('button');
        buttonSquare.setAttribute('title', 'Draw square');
        buttonSquare.id = buttonSquare.draw = 'Square';
        buttonSquare.type_control = 'draw';
        buttonSquare.addEventListener('click', this.handleButtonsClick, false);
        elementDrawButtons.push(buttonSquare);

        // Circle
        var buttonCircle = this.buttonCircle = document.createElement('button');
        buttonCircle.setAttribute('title', 'Draw circle');
        buttonCircle.id = buttonCircle.draw = 'Circle';
        buttonCircle.type_control = 'draw';
        buttonCircle.addEventListener('click', this.handleButtonsClick, false);
        elementDrawButtons.push(buttonCircle);

        // Polygone
        var buttonPolygone = this.buttonPolygone = document.createElement('button');
        buttonPolygone.setAttribute('title', 'Draw polygone');
        buttonPolygone.id = buttonPolygone.draw = 'Polygon';
        buttonPolygone.type_control = 'draw';
        buttonPolygone.addEventListener('click', this.handleButtonsClick, false);
        elementDrawButtons.push(buttonPolygone);

        // Record add items
        var buttonDrawEnd = this.buttonDrawEnd = document.createElement('button');
        buttonDrawEnd.setAttribute('title', 'Ending draw mode');
        buttonDrawEnd.id = buttonDrawEnd.draw = 'Ending';
        buttonDrawEnd.type_control = 'ending';
        buttonDrawEnd.addEventListener('click', this.handleGroupEnd, false);
        buttonDrawEnd.removeEventListener('dblclick', this.handleGroupEnd);
        elementDrawButtons.push(buttonDrawEnd);


        if (this.tabOptions.style_buttons == "glyphicon") {
            buttonPoint.className = 'glyphicon glyphicon-map-marker';
            buttonLine.className = 'glyphicon icon-large icon-vector-path-line';
            buttonSquare.className = 'glyphicon icon-vector-path-square';
            buttonCircle.className = 'glyphicon icon-vector-path-circle';
            buttonPolygone.className = 'glyphicon icon-vector-path-polygon';
            buttonDrawEnd.className = 'glyphicon glyphicon-ok hidden';
        } else {
            buttonPoint.className = 'glyphicon-vector-path-point';
            buttonLine.className = 'glyphicon-vector-path-line';
            buttonSquare.className = 'glyphicon-vector-path-square';
            buttonCircle.className = 'glyphicon-vector-path-circle';
            buttonPolygone.className = 'glyphicon-vector-path-polygon';
            buttonDrawEnd.className = 'glyphicon-vector-path-ok hidden';
        }

        return elementDrawButtons;
    },

    /**
     * Control buttons
     */
    drawControls: function()
    {
        var elementDrawControls = new ol.Collection();

        var buttonEdit = this.buttonEdit = document.createElement('button');
        buttonEdit.setAttribute('title', 'Edit feature');
        buttonEdit.id = 'Edit';
        buttonEdit.type_control = 'edit';
        buttonEdit.addEventListener('click', this.handleControlsClick, false);
        elementDrawControls.push(buttonEdit);

        // Delete
        var buttonDel = this.buttonEdit = document.createElement('button');
        buttonDel.setAttribute('title', 'Delete feature');
        buttonDel.id = 'Delete';
        buttonDel.type_control = 'delete';
        buttonDel.addEventListener('click', this.handleControlsClick, false);
        elementDrawControls.push(buttonDel);

        var buttonControlEnd = this.buttonControlEnd = document.createElement('button');
        buttonControlEnd.setAttribute('title', 'Ending control mode');
        buttonControlEnd.id = 'EndingControl';
        buttonControlEnd.type_control = 'ending';
        buttonControlEnd.addEventListener('click', this.handleGroupEnd, false);
        buttonControlEnd.removeEventListener('dblclick', this.handleGroupEnd);
        elementDrawControls.push(buttonControlEnd);

        if (this.tabOptions.style_buttons == "glyphicon") {
            buttonEdit.className = 'glyphicon glyphicon-pencil';
            buttonDel.className = 'glyphicon glyphicon-trash';
            buttonControlEnd.className = 'glyphicon glyphicon-ok hidden';

        } else {
            buttonEdit.className = 'glyphicon-vector-path-pencil';
            buttonDel.className = 'glyphicon-vector-path-trash';
            buttonControlEnd.className = 'glyphicon-vector-path-ok hidden';
        }

        return elementDrawControls;
    }
}
