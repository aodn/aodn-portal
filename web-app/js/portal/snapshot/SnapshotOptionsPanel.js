
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.snapshot');

Portal.snapshot.SnapshotOptionsPanel = Ext.extend(Ext.Panel, {

    defaultHeight: 20,

    initComponent: function() {
        Ext.apply(this, {

            layout: "hbox",
            hidden: true,
            items: [

            new Ext.form.ComboBox({

                colspan: 1,
                width: 150,
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
                    url: 'snapshot/listForSnapshotOptions',
                    baseParams: {
                        'owner.id': Portal.app.config.currentUser ? Portal.app.config.currentUser.id : null
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
                    beforequery: function(qe) {
                        delete qe.combo.lastQuery;
                    },
                    select: this.onLoadSelectedSnapshot
                }
            }),
            new Ext.Spacer({
                width: 7
            }),
            new Ext.Button({
                colspan: 1,
                disabled: true,
                text: OpenLayers.i18n('deleteSnapshot'),
                ref: 'btnDelete',
                cls: "floatLeft buttonPad",
                tooltip: OpenLayers.i18n('deleteSnapshotTip'),
                listeners:
                {
                    scope: this,
                    click: this.onDeleteSelectedSnapshot
                }
            }),
            new Ext.Button({
                colspan: 1,
                disabled: true,
                text: OpenLayers.i18n('shareSnapshot'),
                ref: 'btnShare',
                cls: "floatLeft buttonPad",
                tooltip: OpenLayers.i18n('shareSnapshotTip'),
                listeners:
                {
                    scope: this,
                    click: this.onShareSelectedSnapshot
                }
            })
            ]
        });

        Portal.snapshot.SnapshotOptionsPanel.superclass.initComponent.apply(this, arguments);

        this.mon(this.controller, 'snapshotAdded', this.onSnapshotAdded, this);
        this.mon(this.controller, 'snapshotRemoved', this.onSnapshotRemoved, this);

        this.map.events.register('blur', this, function(obj) {
            if (this.el != undefined) {
                this.snapshotCombo.collapse();
            }
        });
    },

    onLoadSelectedSnapshot: function(button, event) {
        var id = this.snapshotCombo.getValue();

        if (!id || id == '') return;

        this.controller.loadSnapshot(id);
        this.enableSnapshotButtons();
    },

    enableSnapshotButtons: function() {
        this.btnDelete.enable();
        this.btnShare.enable();
    },

    onDeleteSelectedSnapshot: function(button, event)
    {
        var id = this.snapshotCombo.getValue();

        if (!id || id == '') return;

        this.controller.deleteSnapshot(id, this.onSuccessfulDelete.createDelegate(this), this.onFailure.createDelegate(this,['Unexpected failure deleting snapshot'],true));
    },

    onShareSelectedSnapshot: function(button, event) {
        var id = this.snapshotCombo.getValue();

        if (!id || id == '') return;

        var curLoc = document.URL;

        if (curLoc.split("?").length == 2)
        {
            curLoc = curLoc.split("?")[0];
        }
        var url = curLoc + 'snapshot/loadMap/' + id;

        Ext.MessageBox.show({
            title:OpenLayers.i18n('shareMapDialogTitle'),
            msg: 'You can share a map by using this URL: ' + '<a href="' + url + '" target="_blank">' + url + '</a>'
        });

    },

    onSuccessfulDelete: function() {
        this.snapshotCombo.clearValue();
    },

    onSnapshotAdded: function(snapshot) {
        this.snapshotCombo.store.load({
            scope: this,
            params: {
                recordId: snapshot.id
            },
            callback: function(records, operation, success) {
                    this.snapshotCombo.setValue(operation.params.recordId, true );
                    this.snapshotCombo.fireEvent('select');
            }
        });
    },

    onSnapshotRemoved: function() {
        this.snapshotCombo.store.load();
    },

    onSnapshotsLoaded: function() {
        this.setVisible(this.snapshotCombo.store.getCount() > 0);
    },

    onFailure: function(errors, message) {
        Ext.Msg.alert(message, errors);
    }

});
