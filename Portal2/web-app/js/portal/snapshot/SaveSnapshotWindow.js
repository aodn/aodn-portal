Ext.namespace('Portal.snapshot');

Portal.snapshot.SaveSnapshotWindow = Ext.extend(Ext.Window, {
  title: 'Save Snapshot',
  modal: true,
  layout: 'fit',

  initComponent: function() {
    Ext.apply(this, {
      items: {
        autoHeight: true,
        autoWidth: true,
        padding: 5,
        xtype: 'form',
        items: [{
          ref: '../tfdName',
          name: 'name',
          fieldLabel: 'Name',
          xtype: 'textfield'        
        }],
        buttons: [{
          text: 'Save',
          handler: this.onSave,
          scope: this
        },{
          text: 'Cancel',
          handler: this.onCancel,
          scope: this
        }],
        keys: [{
          key: [Ext.EventObject.ENTER], 
          handler: this.onSave,
          scope: this
        },{
          key: [Ext.EventObject.ESCAPE], 
          handler: this.onCancel,
          scope: this
        }]
      },
      listeners: {
        show: this.onShow,
        scope: this
      }
    });

    Portal.snapshot.SaveSnapshotWindow.superclass.initComponent.apply(this, arguments);
  },

  onShow: function() {
    // place cursor in name field
    this.tfdName.focus.defer(500, this.tfdName);
  },

  onCancel: function() {
    this.close();
  },

  onSave: function() {
    this.saveSnapshot();
    this.hide();
  },
  
  saveSnapshot: function() {
    var bbox = this.map.getExtent().toArray();

    var snapshot = new Portal.snapshot.Snapshot({
      owner: Portal.app.config.currentUser.id, 
      name: this.tfdName.getValue(), 
      minX: bbox[0], 
      minY: bbox[1],
      maxX: bbox[2],
      maxY: bbox[3]
    });

    var mapLayers = this.map.layers;

    for (var i=0; i < mapLayers.length; i++) {
      if (mapLayers[i].grailsLayerId) {
        snapshot.addLayer({
          layer: mapLayers[i].grailsLayerId,
          isBaseLayer: mapLayers[i].isBaseLayer,
          hidden: !mapLayers[i].getVisibility()
        });
      }
    };

    snapshot.save(this.onSuccessfulSave.createDelegate(this), this.onFailedSave.createDelegate(this));
  },

  onSuccessfulSave: function() {
    this.close();
  },

  onFailedSave: function(response, options, errors) {
    Ext.Msg.alert("Unexpected failure saving snapshot", errors);
    this.close();
  },

});