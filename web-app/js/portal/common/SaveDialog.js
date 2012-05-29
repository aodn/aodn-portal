Ext.namespace('Portal.common');

Portal.common.SaveDialog = Ext.extend(Ext.Window, {
	
	nameFieldLabel: null,
	failedSaveErrMsg: null,
	
  initComponent: function() {
    Ext.apply(this, {
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
          fieldLabel: this.nameFieldLabel,
          xtype: 'textfield'        
        }],
        buttons: [{
          text: OpenLayers.i18n('btnSave'),
          ref: '../../btnSave',
          listeners: {
            scope: this,
            click: this.onSave
          }
        },{
          text: OpenLayers.i18n('btnCancel'),
          ref: '../../btnCancel',
          listeners: {
            scope: this,
            click: this.onCancel
          }
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

    Portal.common.SaveDialog.superclass.initComponent.apply(this, arguments);
  },

  onShow: function() {
    // place cursor in name field
    this.nameField.focus.defer(500, this.nameField);
  },

  onCancel: function() {
    this.close();
  },

  onSuccessfulSave: function() {
    this.close(); 
  },

  onFailedSave: function(errors) {
    Ext.Msg.alert(this.failedSaveErrMsg, errors);
    this.close();
  }
});

Ext.reg('portal.common.savedialog', Portal.common.SaveDialog);
