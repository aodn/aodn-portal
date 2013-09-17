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

        Ext.each(this.store.data.items, function(item) {
            var collection = item.data;

            html += tpl.apply(collection);

            this._replacePlaceholderWithButton(html, collection);
        }, this);

        this.update(html);
    },

    _replacePlaceholderWithButton: function(html, collection) {

        var elementId = 'download-button-' + collection.uuid;

        // Don't create button if no placeholder exists
        if (html.indexOf(elementId) != -1) {

            this._createDownloadButton.defer(1, this, [html, 'Download as...', elementId, collection]);
        }
    },

    _createDownloadButton: function(html, value, id, collection) {

        var downloadMenu = new Ext.menu.Menu({
            items: this._createMenuItems(collection)
        });

        new Ext.Button({
            text: value,
            iconCls: '',
            scope: this,
            menu: downloadMenu
        }).render(html, id);
    },

    _createMenuItems: function(collection) {

        return [
            {text: 'Download as .csv', handler: this._downloadHandlerFor(collection, 'csv')},
            {text: 'Download as .kml', handler: this._downloadHandlerFor(collection, 'kml')}
        ];
    },

    _downloadHandlerFor: function(collection, format) {

        var downloadUrl = this._wfsUrlForGeoNetworkRecord(collection, format);

        return function() {

            new Portal.cart.DownloadConfirmationWindow({downloadUrl: downloadUrl}).show();
        };
    },

    _wfsUrlForGeoNetworkRecord: function(record, format) {

        return record.wmsLayer.getFeatureRequestUrl(format);
    }
});
