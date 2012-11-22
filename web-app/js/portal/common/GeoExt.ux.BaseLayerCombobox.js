
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

/**
 * Copyright (c) 2008-2009 The Open Source Geospatial Foundation
 *
 * Published under the BSD license.
 * See http://svn.geoext.org/core/trunk/geoext/license.txt for the full text
 * of the license.
 */

Ext.ns('GeoExt.ux');

/**
 *
 * A combo box in order to switch the base layers of a given map 
 *
 *
 * @constructor
 * @extends Ext.form.ComboBox
 *
 */
GeoExt.ux.BaseLayerComboBox = Ext.extend(Ext.form.ComboBox, {
    
    
    /** api: config[map]
     *  ``OpenLayers.Map or Object``  A configured map or a configuration object
     *  for the map constructor, required only if :attr:`zoom` is set to
     *  value greater than or equal to 0.
     */
    /** private: property[map]
     *  ``OpenLayers.Map``  The map object.
     */
    map: null,
    
    /** api: config[store]
     *  ``GeoExt.data.LayerStore`` A configured LayerStore
     */
    /** private: property[store]
     *  ``GeoExt.data.LayerStore``  The layer store of the map.
     */
    store: null,

    /** api: config[width]
     *  See http://www.dev.sencha.com/deploy/dev/docs/source/BoxComponent.html#cfg-Ext.BoxComponent-width,
     *  default value is 350.
     */
    //width: 250,

    /** api: config[listWidth]
     *  See http://www.dev.sencha.com/deploy/dev/docs/source/Combo.html#cfg-Ext.form.ComboBox-listWidth,
     *  default value is 350.
     */
    //listWidth: 250,

    /** api: config[emptyText]
     *  See http://www.dev.sencha.com/deploy/dev/docs/source/TextField.html#cfg-Ext.form.TextField-emptyText,
     *  default value is "Search location in Geonames".
     */
    emptyText: 'Choose a Base Layer',

    /** api: config[zoom]
     *  ``Number`` Zoom level for recentering the map after search, if set to
     *  a negative number the map isn't recentered, defaults to 8.
     */
    /** private: property[zoom]
     *  ``Number``
     */
    zoom: 8,

    /** api: config[lang]
     *  ``String`` Place name and country name will be returned in the specified
     *  language. Default is English (en). See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[lang]
     *  ``String``
     */
    lang: 'en',

    /** api: config[charset]
     *  `String` Defines the encoding used for the document returned by
     *  the web service, defaults to 'UTF8'.
     *  See: http://www.geonames.org/export/geonames-search.html
     */
    /** private: property[charset]
     *  ``String``
     */
    charset: 'UTF8',

    /** private: property[hideTrigger]
     *  Hide trigger of the combo.
     */
    hideTrigger: false,

    /** private: property[displayField]
     *  Display field name
     */
    displayField: 'name',

    /** private: property[forceSelection]
     *  Force selection.
     */
    forceSelection: true,
    
    /** private: property[triggerAction]
     *  trigger Action
     */
    triggerAction: 'all',

    /** private: property[mode]
     *  mode
     */
    mode: 'local',

    /** private: constructor
     */
    initComponent: function(){
        GeoExt.ux.BaseLayerComboBox.superclass.initComponent.apply(this, arguments);
        
        if (this.initialConfig.map !== null && this.initialConfig.map instanceof OpenLayers.Map && this.initialConfig.map.allOverlays === false) {
        
            this.map = this.initialConfig.map;
            
            
            // create layer store with only baselayers
            this.store = new GeoExt.data.LayerStore({
                layers: this.map.getLayersBy('isBaseLayer', true)//,
               // map: this.map //  THIS NOT NEEDED. map from initialConfig used
            });
            
            
            
            // set the display field
            this.displayField = this.store.fields.keys[1];
            // set an initial value
            //this.setValue(this.map.baseLayer.name);
            
            // set the select handler
            this.on('select', function(combo, record, idx){
                //record.getLayer(idx).setVisibility(true);
                this.map.setBaseLayer(record.getLayer(idx));
            }, this);
            
            // register event if base layer changes
            this.map.events.register('changebaselayer', this, function(obj){
                this.setValue(obj.layer.name);
            });
			
			this.map.events.register('blur', this, function(obj){
				this.collapse();
            });
        }
    },	// eo function initComponent
	
	reload: function() {
		    // reload layer store with 'new' baselayers
		    this.store = new GeoExt.data.LayerStore({
                layers: this.map.getLayersBy('isBaseLayer', true)
            });
	}
});

/** api: xtype = gxux_baselayer_combobox */
Ext.reg('gxux_baselayer_combobox', GeoExt.ux.BaseLayerComboBox);
