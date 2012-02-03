Ext.namespace('Portal.snapshot');

Portal.snapshot.SaveSnapshotDialog = Ext.extend(Ext.Window, {
  initComponent: function() {
    Ext.apply(this, {
      title: 'Save Snapshot',
      modal: true,
      layout: 'fit',
      items: {
        autoHeight: true,
        autoWidth: true,
        padding: 5,
        xtype: 'form',
        items: [{
          ref: '../nameField',
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

    Portal.snapshot.SaveSnapshotDialog.superclass.initComponent.apply(this, arguments);
  },

  onShow: function() {
    // place cursor in name field
    this.nameField.focus.defer(500, this.nameField);
  },

  onCancel: function() {
    this.close();
  },

  onSave: function() {
    this.controller.createSnapshot(this.nameField.getValue(), this.onSuccessfulSave, this.onFailedSave);
    this.hide();
  },
  
  onSuccessfulSave: function() {
    this.close();
  },

  onFailedSave: function(errors) {
    Ext.Msg.alert("Unexpected failure saving snapshot", errors);
    this.close();
  },

});