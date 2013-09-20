/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadPanel = Ext.extend(Ext.Panel, {

    initComponent: function(cfg) {

        var config = Ext.apply({
            title: 'Data Download Tools',
            headerCfg: {
                cls: 'x-panel-header p-header-space'
            },
            autoScroll: true
        }, cfg);

        this.store = Portal.data.ActiveGeoNetworkRecordStore.instance();
        this.confirmationWindow = new Portal.cart.DownloadConfirmationWindow();

        Ext.apply(this, config);
        Portal.cart.DownloadPanel.superclass.initComponent.call(this, arguments);

        this.on('beforeshow', function() { this.onBeforeShow() }, this);
    },

    onBeforeShow: function() {

        this.generateContent();
    },

    generateContent: function() {

        var tpl = new Portal.cart.DownloadPanelTemplate();
        var html = '';

        // Reverse the order of items, last item added will be displayed first
        for (i = this.store.data.items.length - 1; i >= 0; i--) {

            var item = this.store.data.items[i];

            var collection = item.data;

            html += tpl.apply(collection);

            this._replacePlaceholderWithButton(html, collection);
        }

        if (!html) {

            html = this._contentForEmptyView();
        }

        this.update(html);
    },

    _contentForEmptyView: function() {

        return '<i>' + OpenLayers.i18n('emptyCartText') + '</i>';
    },

    _replacePlaceholderWithButton: function(html, collection) {

        var elementId = 'wfs-download-button-' + collection.uuid;

        // Don't create button if no placeholder exists
        if (html.indexOf(elementId) >= 0) {

            this._createDownloadButton.defer(1, this, [html, 'Download as...', elementId, collection]);
        }
    },

    _createDownloadButton: function(html, value, id, collection) {

        var downloadMenu = new Ext.menu.Menu({
            items: this._createMenuItems(collection)
        });

        new Ext.Button({
            text: value,
            icon: 'images/down.png',
            scope: this,
            menu: downloadMenu
        }).render(html, id);
    },

    _createMenuItems: function(collection) {

        return [
            {text: 'Download as CSV', handler: this._downloadHandlerFor(collection, 'csv'), scope: this},
            {text: 'Download as GML3', handler: this._downloadHandlerFor(collection, 'gml3'), scope: this},
            {text: 'Download as Shapefile', handler: this._downloadHandlerFor(collection, 'shape-zip'), scope: this}
        ];
    },

    _downloadHandlerFor: function(collection, format) {

        var downloadUrl = this._wfsUrlForGeoNetworkRecord(collection, format);

        return function() {

            this.confirmationWindow.showIfNeeded(downloadUrl);
        };
    },

    _wfsUrlForGeoNetworkRecord: function(record, format) {

        return record.wmsLayer.getFeatureRequestUrl(format);
    }
});
