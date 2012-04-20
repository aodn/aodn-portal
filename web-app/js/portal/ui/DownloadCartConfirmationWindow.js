Ext.namespace('Portal.ui');

Portal.ui.DownloadCartConfirmationWindow = Ext.extend(Ext.Window, {

    initComponent: function() {

        // Content
        var contentPanel = new Ext.Panel({
            html: Portal.app.config.downloadCartConfirmationWindowContent,
            width: 450,
            resizable: false
        });

        // Controls
        var downloadButton = {
            text: OpenLayers.i18n('downloadCartConfirmationDownloadText'),
            listeners: {
                scope: this,
                click: this.onAccept
            }
        };
        var cancelButton = {
            text: OpenLayers.i18n('downloadCartConfirmationCancelText'),
            listeners: {
                scope: this,
                click: this.onCancel
            }
        };

        Ext.apply(this, {
            title: OpenLayers.i18n('downloadCartConfirmationWindowTitle'),
            modal: true,
            layout: 'fit',
            items: {
                autoHeight: true,
                autoWidth: true,
                padding: 5,
                xtype: 'form',
                items: [contentPanel],
                buttons: [downloadButton, cancelButton],
                keys: [{
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

        Portal.ui.DownloadCartConfirmationWindow.superclass.initComponent.apply(this, arguments);
    },

    onAccept: function() {

        window.location.href = "downloadCart/download";
        this.close();
    },

    onCancel: function() {
        this.close();
    }
});