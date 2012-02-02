Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotOptionsGroup = Ext.extend(Ext.Panel,
{
  layout: "hbox",

  initComponent: function() {
    Ext.apply(this, {
      hidden: !Portal.app.config.currentUser,
      items:
        [
         new Ext.form.ComboBox(
             {
               width: 175,
               editable :false,
               padding: 20,
               emptyText: 'Choose a Saved Map',
               minChars: 0,
               displayField: 'name',
               valueField: 'id',
               ref: 'cmbSnapshot',
               store: new Ext.data.JsonStore({
                 autoLoad: Portal.app.config.currentUser,
                 autoDestroy: true,
                 remote: true,
                 url: 'snapshot/list',
                 baseParams: {
                   type: 'JSON',
                   'owner.id': Portal.app.config.currentUser?Portal.app.config.currentUser.id:null
                 },
                 root: 'data',
                 fields: ['id','name']
               }),
               listeners: {
                 scope: this,
                 beforequery: function(qe){
                     delete qe.combo.lastQuery;
                 },
                 select: this.onSelectSnapshot
             
             }
             }),
         new Ext.Spacer({width: 7}),
         new Ext.Button(
             {
               text: "Delete",
               cls: "floatLeft buttonPad",   
               tooltip: "Delete a saved map",
               listeners:
               {
                 scope: this,
                 click: this.deleteClicked
               }
             })
         ]			
    });

    Portal.snapshot.SnapshotOptionsGroup.superclass.initComponent.apply(this, arguments);
  },

  loadClicked: function(button, event)
  {
    this.loadSelectedSnapshot();
  },

  deleteClicked: function(button, event)
  {
    this.deleteSelectedSnapshot();
  },
  
  deleteSelectedSnapshot: function() {
    var id = this.cmbSnapshot.getValue();
    
    if (!id || id == '') return;

    Portal.snapshot.Snapshot.remove(id, this.onSuccessfulDelete.createDelegate(this), this.onFailedDelete.createDelegate(this));
  },
  
  onSuccessfulDelete: function(response, options) {
    this.cmbSnapshot.clearValue();
  },

  onFailedDelete: function(response, options, errors) {
    Ext.Msg.alert("Unexpected failure deleting snapshot", errors);
  },
  
  onSelectSnapshot: function() {
    this.loadSelectedSnapshot();
  },

  loadSelectedSnapshot: function()
  {
    var id = this.cmbSnapshot.getValue();

    if (!id || id == '') return;

    Portal.snapshot.Snapshot.get(id, this.onSuccessfulGet.createDelegate(this), this.onFailedGet.createDelegate(this));
  },

  onSuccessfulGet: function(snapshot) {
    removeAllLayers();
    
    var bounds = new OpenLayers.Bounds(snapshot.minX, snapshot.minY, snapshot.maxX, snapshot.maxY);
    
    this.map.zoomToExtent(bounds);
    
    for (var i=0; i< snapshot.layers.length; i++) {
      var snapshotLayer = snapshot.layers[i];
      
      if (snapshotLayer.isBaseLayer) {
        if (!snapshotLayer.isHidden) {
          //select baselayer
        }
      } else {
        if (snapshotLayer.layer) {
          addGrailsLayer(snapshotLayer.layer.id);
        } else {
          // add user/search layer
        }
      }
    }
  },

  onFailedGet: function(response, options, errors) {
    Ext.Msg.alert("Unexpected failure loading snapshot", errors);
  }

});
