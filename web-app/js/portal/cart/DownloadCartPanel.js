/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.cart');

Portal.cart.DownloadCartPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        this.listDataView = new Portal.cart.DownloadDataView();
        this.lastCartRemovedUuid = [];

        this.doUndoButton = new Ext.ux.Hyperlink({
            tooltip: OpenLayers.i18n('downloadCartUndo'),
            cls: 'floatRight styledButton',
            disabledClass: 'disabled',
            hidden: true,
            text: OpenLayers.i18n('downloadCartUndo'),
            listeners: {
                scope: this,
                'click': function() {
                    this.doUndo();
                    return false;
                },
                'render': function() {
                    if (this.lastCartRemovedUuid.length > 0){
                        this.doUndoButton.enable();
                    }
                }
            }
        });

        this.doDownloadLink = new Ext.Panel({
            tooltip: OpenLayers.i18n('okdownload'),
            cls: 'floatRight styledButton',
            html: '<a href="#" onclick="javascript:doDownload();">' + OpenLayers.i18n('okdownload') + '</a>'
        });

        this.doClearCartLink = new Ext.Panel({
            tooltip: OpenLayers.i18n('clearcart'),
            cls: 'floatRight styledButton',
            html: '<a href="#" onclick="javascript:clearDownloadCart();">' + OpenLayers.i18n('clearcart') + '</a>'
        });

        var footer = new Ext.Panel( {
            region: 'south',
            height: 80,
            padding: '10px',
            unstyled: true,
            items: [
                this.doUndoButton,
                this.doClearCartLink,
                this.doDownloadLink
            ]
        });

        var config = Ext.apply({

            layout: 'border',
            id: "downloadCartPanel",
            title: 'Home ',
            minHeight: 600,
            items: [
                {
                    // this is a temporary header block until portal 3 workflow
                    region: 'north',
                    height: 50,
                    padding: '0px 5px',
                    html: '<div class="menuHeader">Data Download Cart</div>'
                },
                {
                    region:'center',
                    layout:'fit',
                    padding: '0px 20px',
                    stateful: false,
                    items: [
                        this.listDataView
                    ]
                },
                footer
            ]
        }, cfg);

        Portal.cart.DownloadCartPanel.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe("downloadCart.cartRecordRemoved", function (name,record_uuid) {
            this.lastCartRemovedUuid.push(record_uuid);
            this.doUndoButton.enable().show();
        }, this);

        Ext.MsgBus.subscribe("downloadCart.cartCleared", function () {
            this.lastCartRemovedUuid = [];
            this.doUndoButton.disable();
        }, this);

        Ext.MsgBus.subscribe("downloadCart.cartContentsUpdated", function (name, count) {
            if(count === "0") {
                this.doClearCartLink.disable();
                this.doDownloadLink.disable();
            }
            else {
                this.doDownloadLink.enable();
                this.doClearCartLink.enable();
            }
        }, this);
    },

    // cart last remove record undo
    doUndo: function () {

        setDownloadCartRecordDisableFlag(this.lastCartRemovedUuid.pop(),false);
        if (this.lastCartRemovedUuid.length == 0){
            this.doUndoButton.disable();
        }
    }
});
