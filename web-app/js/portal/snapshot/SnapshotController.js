/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotController = Ext.extend(Portal.common.Controller, {
    constructor : function(config) {
        config = config || {};
        Ext.apply(this, config);

        this.addEvents({
            snapshotAdded : true,
            snapshotDeleted : true
        });

        this.proxy = new Portal.snapshot.SnapshotProxy();

        Portal.snapshot.SnapshotController.superclass.constructor.apply(this,
                arguments);
    },

    createSnapshot : function(name, successCallback, failureCallback) {
        var bbox = this.map.getExtent().toArray();

        var snapshot = {
            owner : Portal.app.config.currentUser.id,
            name : name,
            minX : bbox[0],
            minY : bbox[1],
            maxX : bbox[2],
            maxY : bbox[3],
            layers : []
        };

        var mapLayers = this.map.layers;

        for ( var i = 0; i < mapLayers.length; i++) {
            var snapshotLayer = this.getSnapshotLayer(mapLayers[i]);
            snapshot.layers.push(snapshotLayer);
        }
        ;

        this.proxy.save(snapshot, this.onSuccessfulSave.createDelegate(this,
                [ successCallback ], true), failureCallback);
    },

    onSuccessfulSave : function(snapshot, successCallback) {
        this.fireEvent('snapshotAdded', snapshot);

        if (successCallback) {
            successCallback(snapshot);
        }
    },

    loadSnapshot : function(id, successCallback, failureCallback) {
        
        Ext.MsgBus.publish('reset');
        this.proxy.get(id, this.onSuccessfulLoad.createDelegate(this,
                [ successCallback ], true), failureCallback);
    },

    _doLoadLayers : function(bounds, snapshot, successCallback) {
        this.map.zoomToExtent(bounds, true);
        for ( var i = 0; i < snapshot.layers.length; i++) {
            this.addSnapshotLayer(snapshot.layers[i]);
        }

        if (successCallback) {
            successCallback(snapshot);
        }

    },

    onSuccessfulLoad : function(snapshot, successCallback) {
        this.fireEvent('snapshotLoaded');

        var bounds = new OpenLayers.Bounds(snapshot.minX, snapshot.minY,
                snapshot.maxX, snapshot.maxY);

        if (this.map.baseLayer === null) {
            this.mapScope.on('baselayersloaded', function() {
                this._doLoadLayers(bounds, snapshot, successCallback);
            }, this);
        } else {
            this._doLoadLayers(bounds, snapshot, successCallback);
        }
    },

    deleteSnapshot : function(id, successCallback, failureCallback) {
        this.proxy.remove(id, this.onSuccessfulDelete.createDelegate(this,
                [ successCallback ]), failureCallback);
    },

    onSuccessfulDelete : function(successCallback) {
        this.fireEvent('snapshotDeleted');

        if (successCallback) {
            successCallback();
        }
    },

    // private functions

    getSnapshotLayer : function(mapLayer) {
        var layer = {};
        if (mapLayer.isAnimatedSlice != undefined) {
            return; // don't save it
        }
        if (mapLayer.isAnimated) { // changing isAnimated to indicate it is the
                                    // original layer that is animated
            // animated layers - save original layer details plus animation
            // settings
            layer.layer = mapLayer.grailsLayerId;
            layer.animated = true;
            layer.chosenTimes = mapLayer.chosenTimes;
            layer.styles = mapLayer.params.STYLES;
        } else if (mapLayer.grailsLayerId) {
            // layers sourced from server
            layer.layer = mapLayer.grailsLayerId;
        } else if (!layer.animated) {
            // layers added from search
            layer.name = mapLayer.params.LAYERS;
            layer.title = mapLayer.name;
            layer.serviceUrl = mapLayer.server.uri;
        }
        if (mapLayer.opacity != undefined) {
            layer.opacity = mapLayer.opacity;
        }
        if (mapLayer.params != undefined) {
            layer.styles = mapLayer.params.STYLES;

            if (mapLayer.params.CQL_FILTER != undefined) {
                layer.cql = mapLayer.params.CQL_FILTER;
            }

        }
        layer.isBaseLayer = mapLayer.isBaseLayer;
        // using hidden as per OGC WMC spec but visible may make more sense!
        layer.hidden = !mapLayer.getVisibility();
        return layer;
    },

    addSnapshotLayer : function(snapshotLayer) {
        var options = {
            visibility : !snapshotLayer.hidden
        };

        if (snapshotLayer.opacity) {
            options.opacity = snapshotLayer.opacity;
        }

        var params = {
            styles : snapshotLayer.styles
        };

        if (snapshotLayer.cql != undefined && snapshotLayer.cql.length > 0) {
            params["CQL_FILTER"] = snapshotLayer.cql;
        }

        if (snapshotLayer.isBaseLayer) {
            if (!snapshotLayer.hidden) {
                // find and display baselayer if it still exists
                var matchingLayers = this.map.getLayersBy("grailsLayerId",
                        snapshotLayer.layer.id);
                if (matchingLayers.length > 0)
                    this.map.setBaseLayer(matchingLayers[0]);
            }
        } 
        else {
            if (snapshotLayer.layer) {
                
                Ext.MsgBus.publish('addLayerUsingServerId', {
                    id: snapshotLayer.layer.id, 
                    layerOptions: options, 
                    layerParams: params,
                    animated: snapshotLayer.animated, 
                    chosenTimes: snapshotLayer.chosenTimes
                });
            } 
            else {
                var layerDescriptor = new Portal.common.LayerDescriptor(this.getLayerDef(snapshotLayer));
                Ext.MsgBus.publish('addLayerUsingOpenLayer', layerDescriptor.toOpenLayer(options, params));
            }
        }
    },

    getLayerDef : function(snapshotLayer) {
        return {
            title : snapshotLayer.title,
            server : {
                uri : snapshotLayer.serviceUrl,
                type : 'WMS'
            },
            name : snapshotLayer.name
        };
    },

    addMapLayer : function(layerDef, options, params) {
        if (Ext.isFunction(this.addMapLayerFn)) {
            var delegate = this.addMapLayerFn.createDelegate(this.mapScope, [
                    layerDef, options, params ]);
            delegate.call();
        }
    }

});
