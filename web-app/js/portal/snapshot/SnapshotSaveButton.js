Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotSaveButton = Ext.extend(Ext.Button, {
   
  initComponent: function() {
    Ext.apply(this, {
      text: OpenLayers.i18n('saveMapButton'),
      cls: "floatLeft buttonPad",   
      tooltip: OpenLayers.i18n('saveMapButtonTip'),
      hidden: !Portal.app.config.currentUser,
      listeners: {
        click: this.onShowSaveDialog,
        scope: this
      }
    });
    
    Portal.snapshot.SnapshotSaveButton.superclass.initComponent.apply(this, arguments);
  },
  
  onShowSaveDialog: function()
  {
    var saveSnapshotDialog = new Portal.snapshot.SaveSnapshotDialog({
      controller: this.controller
    });
    
    saveSnapshotDialog.show();
  }
  
});
