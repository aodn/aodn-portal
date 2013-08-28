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

        var createButton = function(value, id, record, handler) {
            new Ext.Button({
                text: value,
                handler: handler,
                scope: self,
                disabled: Portal.data.ActiveGeoNetworkRecordStore.instance().containsUuid(record.get('uuid'))
            }).render(document.body, id);
        };

        var componentId = Ext.id();
        var buttonHandler = function(button, e) {
            this._viewButtonOnClick(record);
        };
        createButton.defer(1, this, ['View', componentId, record, buttonHandler]);

        return('<div id="' + componentId + '"></div>');
    },

    _viewButtonOnClick: function(recordToView) {
        Portal.data.ActiveGeoNetworkRecordStore.instance().add(recordToView);
    }
});

Ext.grid.Column.types.viewrecordcolumn = Portal.search.ViewRecordColumn;
