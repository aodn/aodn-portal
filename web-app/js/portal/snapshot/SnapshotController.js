Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotController = Ext.extend(Ext.util.Observable, {
  constructor: function(config) {
    config = config || {};
    Ext.apply(this, config);
    
    this.addEvents({
      snapshotsChanged: true,
    });
    
    this.proxy = new Portal.snapshot.SnapshotProxy();
    
    Portal.snapshot.SnapshotController.superclass.constructor.apply(this, arguments);
  },
  
  createSnapshot: function(name, successCallback, failureCallback) {
    var bbox = this.map.getExtent().toArray();

    var snapshot = {
      owner: Portal.app.config.currentUser.id, 
      name: name, 
      minX: bbox[0], 
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3],
      layers: []
    };

    var mapLayers = this.map.layers;

    for (var i=0; i < mapLayers.length; i++) {
      var layer = {};
      if (mapLayers[i].grailsLayerId) {
        // layers sourced from server
        layer.layer = mapLayers[i].grailsLayerId;
      } else {
        // layers added from search
        layer.name = mapLayers[i].params.LAYERS;
        layer.title = mapLayers[i].name;
        layer.serviceUrl = mapLayers[i].server.uri;
      }
      layer.isBaseLayer= mapLayers[i].isBaseLayer;
      layer.hidden= !mapLayers[i].getVisibility();
      snapshot.layers.push(layer);
    };

    this.proxy.save(snapshot, this.onSuccessfulSave.createDelegate(this,[successCallback],true), failureCallback);
  },
  
  onSuccessfulSave: function(snapshot, successCallback) {
    this.fireEvent('snapshotsChanged');
    
    if (successCallback) {
      successCallback(snapshot);
    }
  },
  
  loadSnapshot: function(id, successCallback, failureCallback) {
    this.proxy.get(id, this.onSuccessfulLoad.createDelegate(this,[successCallback],true), failureCallback);
  },
  
  onSuccessfulLoad: function(snapshot, successCallback) {
    removeAllLayers();
    
    var bounds = new OpenLayers.Bounds(snapshot.minX, snapshot.minY, snapshot.maxX, snapshot.maxY);
    
    this.map.zoomToExtent(bounds, true);
    
    for (var i=0; i< snapshot.layers.length; i++) {
      var snapshotLayer = snapshot.layers[i];
      
      var options = {
          visibility: !snapshotLayer.hidden
      };
      
      if (snapshotLayer.isBaseLayer) {
        if (!snapshotLayer.hidden) {
          //select baselayer
        }
      } else {
        if (snapshotLayer.layer) {
          addGrailsLayer(snapshotLayer.layer.id, options);
        } else {
          var layerDef = {
            title: snapshotLayer.title,
            server: {
              uri: snapshotLayer.serviceUrl,
              type: 'WMS'
            },
            name: snapshotLayer.name
          };
          addMainMapLayer(layerDef, options);
        }
      }
    }
    
    if (successCallback) {
      successCallback(snapshot);
    }
  },
  
  deleteSnapshot: function(id, successCallback, failureCallback) {
    this.proxy.remove(id, this.onSuccessfulDelete.createDelegate(this,[successCallback]), failureCallback);
  },
  
  onSuccessfulDelete: function(successCallback) {
    this.fireEvent('snapshotsChanged');
    
    if (successCallback) {
      successCallback();
    }
  },
  
});