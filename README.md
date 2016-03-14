OpenLayers Drawing Plugin
===================

Welcome !! DrawButtons is an OpenLayers 3 plugin for drawing new features, edit or delete feature from map. See [usage](https://rawgit.com/HamHamFonFon/ol3-drawButtons/master/examples/index.html) for demo.

Plugin Status
-------------
Is currently in Beta stage of development.
v. 0.1.0

Requirements
-------------
 - Openlayers 3


Getting started
-------------
  - Clone the repository : `git clone git@github.com:HamHamFonFon/ol3-drawButtons.git ol3-drawButtons`
  - Adding script JS and style CSS on your HTML code

Demo examples
-------------

This exemple is showing how to use the plugin
	
  - [Basic usage](https://rawgit.com/HamHamFonFon/ol3-drawButtons/master/examples/basic_use.html) : you can add new features to the map, then editing or deleting them

API
-------------

### `new ol.control.DrawButtons(vector_layer, opt_options)`

#### vector_layer
Layer you will adding, edit or delete features
```javascript
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
```

#### Options parameters

|Option name|Type|Description|
 ----------------- | ---------------------------- | ------------------
| `popup_form`    |`Boolean`| (not implemented yet) |
| `style_buttons` |`String`| Use bootstrap glyphicon or default CSS. Values : `glyphicon|default`|
| `local_storage` |`Boolean`| (in progress) Possibility to record Layer in Local Storage
| `draw`          |`Array`| Select buttons to show|
|  - Point      |`Boolean`|Show point button|
|  - LineString    |`Boolean`|Show line button|
|  - Square        |`Boolean`|Show square button|
|  - Circle        |`Boolean`|Show circle button|
|  - Polygon       |`Boolean`|Show polygon button|


#### Exemple usage

```javascript
var optionsControlDraw = {
    "popup_form" : false,
    "style_buttons" : (undefined !== typeof style_buttons)? "glyphicon" : "default",
    "local_storage": false,
    "draw": {
        "Point": true,
        "LineString": true,
        "Square": true,
        "Circle": true,
        "Polygon": true
    }
};
var buttonsDrawControls = new ol.control.DrawButtons(myVectorLayer, optionsControlDraw);
```

#### Extends

`ol.control.Control`

#### Methods

##### `setSelectedLayer()`
Set a layer who may be different tha the one in options array
```javascript
buttonsDrawControls.setSelectedLayer(otherVectorLayer);
```

TODO and In progress
-------------
  - Add popin for adding properties to new feature
  - Using local storage
  - Add plugins for record in databases
   
Author(s)
-------------
Stéphane MÉAUDRE
 <stephane.meaudre@gmail.com> <smeaudre@kaliop.com>

Licence
-------------
MIT Licence - 2016

See also
-------------
My POC based on [Kuzzle](http://kuzzle.io/) : [Kurtography](https://github.com/HamHamFonFon/kurtogaphy)


README.md edited by [StackEdit](https://stackedit.io)
