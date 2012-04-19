Ext.namespace('Portal.snapshot');

Portal.snapshot.SaveSnapshotDialog = Ext.extend(Portal.common.SaveDialog, {
	
	constructor: function(cfg) {
		
		var config = Ext.apply({
			title: OpenLayers.i18n('saveSnapshotDialogTitle'),
			nameFieldLabel: OpenLayers.i18n('saveSnapshotName'),
			failedSaveErrMsg: OpenLayers.i18n('saveSnapshotFailureErrMsg')
		}, cfg);
		
		Portal.snapshot.SaveSnapshotDialog.superclass.constructor.call(this, config);
	},
	
    onSave: function() {
	  this.controller.createSnapshot(this.nameField.getValue(), this.onSuccessfulSave, this.onFailedSave);
	  this.hide();
	}
});
