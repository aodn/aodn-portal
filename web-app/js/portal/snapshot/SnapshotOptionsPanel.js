Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotOptionsPanel = Ext.extend(Ext.Panel, {
  initComponent: function() {
    Ext.apply(this, {
      layout: "hbox",
      hidden: true,
      items: [
        new Ext.form.ComboBox({
          width: 175,
          editable :false,
          padding: 20,
          ref: 'snapshotCombo',
          emptyText: OpenLayers.i18n('chooseSavedMap'),
          minChars: 0,
          displayField: 'name',
          valueField: 'id',
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
            fields: ['id','name'],
            listeners: {
              scope: this,
              load: this.onSnapshotsLoaded
            }
          }),
          listeners: {
            scope: this,
            beforequery: function(qe){
              delete qe.combo.lastQuery;
            },
            select: this.onLoadSelectedSnapshot
          }
        }),
        new Ext.Spacer({width: 7}),
        new Ext.Button({
          text: OpenLayers.i18n('deleteSnapshot'),
          cls: "floatLeft buttonPad",   
          tooltip: OpenLayers.i18n('deleteSnapshotTip'),
          listeners:
          {
            scope: this,
            click: this.onDeleteSelectedSnapshot
          }
        })
      ]      
    });
    
    Portal.snapshot.SnapshotOptionsPanel.superclass.initComponent.apply(this, arguments);
    
    this.mon(this.controller, 'snapshotsChanged', this.onSnapshotsChanged, this);
  },

  onLoadSelectedSnapshot: function(button, event) {
    var id = this.snapshotCombo.getValue();

    if (!id || id == '') return;

    this.controller.loadSnapshot(id, null, this.onFailure.createDelegate(this,['Unexpected failure loading snapshot'],true));
  },

  onDeleteSelectedSnapshot: function(button, event)
  {
    var id = this.snapshotCombo.getValue();
    
    if (!id || id == '') return;

    this.controller.deleteSnapshot(id, this.onSuccessfulDelete.createDelegate(this), this.onFailure.createDelegate(this,['Unexpected failure deleting snapshot'],true));
  },
  
  onSuccessfulDelete: function() {
    this.snapshotCombo.clearValue();
  },

  onSnapshotsChanged: function() {
    this.snapshotCombo.store.load();
  },
  
  onSnapshotsLoaded: function() {
    this.setVisible(this.snapshotCombo.store.getCount() > 0);
  },
  
  onFailure: function(errors, message) {
    Ext.Msg.alert(message, errors);
  }

});
