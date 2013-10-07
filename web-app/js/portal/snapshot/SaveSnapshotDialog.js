
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.snapshot');

Portal.snapshot.SaveSnapshotDialog = Ext.extend(Portal.common.SaveDialog, {

    constructor: function(cfg) {
        var config = Ext.apply({
            title: OpenLayers.i18n('saveSnapshotDialogTitle'),
            nameFieldLabel: OpenLayers.i18n('saveSnapshotName')
        }, cfg);

        Portal.snapshot.SaveSnapshotDialog.superclass.constructor.call(this, config);
    },

    onSave: function() {
        this.controller.createSnapshot(this.nameField.getValue(), this.onSuccessfulSave.createDelegate(this), this.onFailedSave.createDelegate(this));
        //this.close();
    }
});
