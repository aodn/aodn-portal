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
            text:OpenLayers.i18n('downloadCartConfirmationDownloadText'),
            listeners:{
                scope:this,
                click:this.onAccept
            }
        };
        var cancelButton = {
            text:OpenLayers.i18n('downloadCartConfirmationCancelText'),
            listeners:{
                scope:this,
                click:this.onCancel
            }
        };

        Ext.apply(this, {
            title:OpenLayers.i18n('downloadCartConfirmationWindowTitle'),
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

    onAccept: function() {

        this.close();

        if (this.downloadUrl) {

            this._setWindowLocation(this.downloadUrl);
        }
    },

    onCancel: function() {

        this.close();
    },

    _setWindowLocation: function(url) {

        window.location.assign(url);
    }
});
