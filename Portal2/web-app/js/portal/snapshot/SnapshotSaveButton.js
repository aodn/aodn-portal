Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotSaveButton = Ext.extend(Ext.Button, {
   
  initComponent: function() {
    Ext.apply(this, {
      text: 'Save Map',
      cls: "floatLeft buttonPad",   
      tooltip: "Save the current state of the map",
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
