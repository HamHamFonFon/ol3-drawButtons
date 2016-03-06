OpenLayers Draw Plugin
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

Examples
-------------

This exemple is showing how to use the plugin
	
  - [Basic usage](https://rawgit.com/HamHamFonFon/ol3-drawButtons/master/examples/index.html) : you can add new features to the map, then editing or deleting them

API
-------------

### `new ol.control.DrawButtons(opt_options)`

### Options parameters

|Option name|Typed|Description|
 ----------------- | ---------------------------- | ------------------
| selectedLayer |Vector layer| Your selected layer you want to work it |
| popup_form    |boolean| (not implemented yet) |
| style_buttons |string| Use bootstrap glyphicon or default CSS|
| draw          |array| Select list of buttons|

#### Extends

`ol.control.Control`


TODO and In progress
-------------
  - Write API in readme.md
  - Add popin for adding properties to new feature
  - Debug deleting feature
   
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
