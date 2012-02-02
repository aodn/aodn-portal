Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotSaveButton = Ext.extend(Ext.Button, {
  
  text: 'Save Map',
  cls: "floatLeft buttonPad",   
  tooltip: "Save the current state of the map",
  
  initComponent: function() {
    Ext.apply(this, {
      hidden: !Portal.app.config.currentUser,
      listeners: {
        click: this.saveClicked,
        scope: this
      }
    });
    
    Portal.snapshot.SnapshotSaveButton.superclass.initComponent.apply(this, arguments);
  },
  
  saveClicked: function() {
    this.showSaveDialog();
  },
  
  showSaveDialog : function()
  {
    new Portal.snapshot.SaveSnapshotWindow({map: this.map}).show();
  }
  
});
