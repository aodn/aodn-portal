
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

/**
 * Contains the set of currently "active" layers in the application, 
 * i.e. those that have been added to the map.
 * 
 * It's intended for this to be generalised when the concept of "bundles"
 * is introduced (i.e. it will store the set of active bundles).
 */
Portal.data.LayerStore = Ext.extend(GeoExt.data.LayerStore, {
    
    constructor: function(cfg) {
    
        Portal.data.LayerStore.superclass.constructor.call(this, cfg);
        
        Ext.MsgBus.subscribe('addLayerUsingDescriptor', function(subject, layerDescriptor) {
            this.addUsingDescriptor(layerDescriptor)
        }, this);

        Ext.MsgBus.subscribe('addLayerUsingOpenLayer', function(subject, openLayer) {
            this.addUsingOpenLayer(openLayer)
        }, this);

        Ext.MsgBus.subscribe('removeLayerUsingOpenLayer', function(subject, openLayer) {
            this.removeUsingOpenLayer(openLayer)
        }, this);
    },
    
    addUsingDescriptor: function(layerDescriptor) {
        
        var openLayer = layerDescriptor.toOpenLayer();
        
        var layerRecord = new GeoExt.data.LayerRecord({
            layer: openLayer,
            title: layerDescriptor.title
        });
        
        this.add(layerRecord);
    },
    
    addUsingOpenLayer: function(openLayer) {
        
        var layerRecord = new GeoExt.data.LayerRecord({
            layer: openLayer,
            title: openLayer.name
        });
        
        this.add(layerRecord);
    },
    
    removeUsingOpenLayer: function(openLayer) {
        
        var layerRecordToRemove = this.getByLayer(openLayer);
        this.remove(layerRecordToRemove);
    }
});
