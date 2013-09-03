/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.ViewRecordColumn = Ext.extend(Ext.grid.Column, {

    constructor: function(config) {
        Portal.search.ViewRecordColumn.superclass.constructor.call(this, config);
    },

    renderer: function(value, metaData, record, rowIndex) {

        var self = this;

        var createButton = function(id, record, handler) {
            new Ext.Button({
                text: self._getViewButtonText(record),
                handler: handler,
                scope: self
            }).render(document.body, id);
        };

        var componentId = Ext.id();
        var buttonHandler = function(button, e) {
            this._viewButtonOnClick(record);
        };
        createButton.defer(1, this, [componentId, record, buttonHandler]);

        return('<div id="' + componentId + '"></div>');
    },

    _viewButtonOnClick: function(record) {
        if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record)) {
            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
        }

        Ext.MsgBus.publish('viewgeonetworkrecord', record);
    },

    _getViewButtonText: function(record) {
        if (Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record)) {
            return 'View';
        }
        else {
            return 'Add & View';
        }
    }
});

Ext.grid.Column.types.viewrecordcolumn = Portal.search.ViewRecordColumn;
