/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.cart');

Portal.cart.DownloadColumnModel = Ext.extend(Ext.grid.ColumnModel, {
    constructor: function() {
        var config = {
            defaults: {
                menuDisabled: true
            },
            columns: [
                {
                    id: 'description',
                    header: OpenLayers.i18n('descHeading'),
                    xtype: 'templatecolumn',
                    tpl: new Portal.cart.DownloadPanelTemplate()
                },
                {
                    id: 'remove',
                    renderer: this._removeColumnRenderer
                }
            ]
        }

        Portal.cart.DownloadColumnModel.superclass.constructor.call(this, config);
    },

    _removeColumnRenderer: function(value, metadata, record, rowIndex, colIndex, store) {

        // This funky stuff has been copied/adapted from FacetedSearchResultsGrid.
        // It's where the worlds of Ext and HTML collide :-(
        var grid = this;

        var createButton = function(value, id, handler) {
            new Ext.Button({
                text: value,
                iconCls: '',
                handler: handler,
                scope: grid
            }).render(document.body, id);
        };

        var componentId = Ext.id();
        var buttonHandler = function(button, e) {
            store.remove(record)
        };
        createButton.defer(1, this, ['Remove', componentId, buttonHandler]);

        return('<div id="' + componentId + '"></div>');
    }
});
