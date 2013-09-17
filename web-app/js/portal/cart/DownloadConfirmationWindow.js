/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.DownloadConfirmationWindow = Ext.extend(Ext.Window, {

    constructor: function(cfg) {

        cfg = cfg || {};

        this.downloadUrl = cfg.downloadUrl;

        Portal.cart.DownloadConfirmationWindow.superclass.constructor.call(this, cfg);
    },

    initComponent: function() {

        // Content
        var contentPanel = new Ext.Panel({
            html:Portal.app.config.downloadCartConfirmationWindowContent,
            width:450,
            resizable:false
        });

        // Controls
        var downloadButton = {
            text:OpenLayers.i18n('downloadConfirmationDownloadText'),
            listeners:{
                scope:this,
                click:this.onAccept
            }
        };
        var cancelButton = {
            text:OpenLayers.i18n('downloadConfirmationCancelText'),
            listeners:{
                scope:this,
                click:this.onCancel
            }
        };

        Ext.apply(this, {
            title:OpenLayers.i18n('downloadConfirmationWindowTitle'),
            modal:true,
            padding:15,
            layout:'fit',
            items:{
                autoHeight:true,
                autoWidth:true,
                padding:5,
                xtype:'form',
                items:[contentPanel],
                buttons:[downloadButton, cancelButton],
                keys:[
                    {
                        key:[Ext.EventObject.ESCAPE],
                        handler:this.onCancel,
                        scope:this
                    }
                ]
            },
            listeners:{
                show:this.onShow,
                scope:this
            }
        });

        Portal.cart.DownloadConfirmationWindow.superclass.initComponent.apply(this, arguments);
    },

    showIfNeeded: function(downloadUrl) {

        this.downloadUrl = downloadUrl;

        if (!this.hasBeenShown) {

            this.show();
        }
        else {

            this.onAccept();
        }
    },

    onAccept: function() {

        this.hide();

        if (this.downloadUrl) {

            this.hasBeenShown = true;
            this._setWindowLocation(this.downloadUrl);
        }
    },

    onCancel: function() {

        this.hide();
    },

    _setWindowLocation: function(url) {

        window.open(url, '_blank');
    }
});
