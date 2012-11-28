
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

        /**
         * A "LayerLink" is a JSON object which is returned from GeoNetwork (I think :-)
         */
        Ext.MsgBus.subscribe('addLayerUsingLayerLink', function(subject, layerLink) {
            this.addUsingLayerLink(layerLink)
        }, this);

        /**
         * This is used when loading WMS layers from 3rd party servers.
         */
        Ext.MsgBus.subscribe('addLayerUsingOpenLayer', function(subject, openLayer) {
            this.addUsingOpenLayer(openLayer)
        }, this);

        /**
         * This will be called when a layer is selected from the "Map Layer Chooser" (in which
         * case the layer relates to a layer stored on the server by the given ID).
         */
        Ext.MsgBus.subscribe('addLayerUsingServerId', function(subject, args) {
            this.addUsingServerId(args)
        }, this);

        Ext.MsgBus.subscribe('removeLayerUsingOpenLayer', function(subject, openLayer) {
            this.removeUsingOpenLayer(openLayer)
        }, this);
    },
    
    addUsingDescriptor: function(layerDescriptor) {
        
        this.addUsingOpenLayer(layerDescriptor.toOpenLayer());
    },
    
    addUsingLayerLink: function(layerLink) {
        
        var serverUri = layerLink.server.uri;

        Ext.Ajax.request({
            url: 'layer/findLayerAsJson?' + Ext.urlEncode({serverUri: serverUri, name: layerLink.name}),
            scope: this,
            success: function(resp) {
                
                var layerDescriptor = new Portal.common.LayerDescriptor(resp.responseText);
                if (layerDescriptor) {
                    layerDescriptor.cql = layerLink.cql
                    this.addUsingDescriptor(layerDescriptor);
                }
            },
            failure: function(resp) {
                // TODO: not sure if this is actually a "valid" case...
                this.addUsingDescriptor(new Portal.common.LayerDescriptor(layerLink));
            }
        });
    },
    
    addUsingOpenLayer: function(openLayer) {
        
        var layerRecord = new GeoExt.data.LayerRecord({
            layer: openLayer,
            title: openLayer.name
        });
        
        this.add(layerRecord);
        
        // Only want to be notified of changes in no base layer
        if (!openLayer.options.isBaseLayer) {
            Ext.MsgBus.publish('selectedLayerChanged', openLayer);
        }
    },
    
    addUsingServerId: function(args) {

        Ext.Ajax.request({

            url: 'layer/showLayerByItsId?layerId=' + args.id,
            layerOptions: args.layerOptions,
            layerParams: args.layerParams,
            animated: args.animated,
            chosenTimes: args.chosenTimes,
            scope: this,
            success: function(resp, options) {
                var layerDescriptor = new Portal.common.LayerDescriptor(resp.responseText);
                this.addUsingOpenLayer(layerDescriptor.toOpenLayer(options.layerOptions, options.layerParams));
                // TODO: chosen times?
            },
            failure: function(resp) {
                Ext.MessageBox.alert('Error', "Sorry I could not load the requested layer:\n" + resp.responseText);
            }
        });
    },

    
    removeUsingOpenLayer: function(openLayer) {
        
        var layerRecordToRemove = this.getByLayer(openLayer);
        this.remove(layerRecordToRemove);
    }
});
