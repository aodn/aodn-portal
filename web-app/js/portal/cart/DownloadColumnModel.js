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
                }
            ]
        };

        Portal.cart.DownloadColumnModel.superclass.constructor.call(this, config);
    },

    refresh: function(store) {

        var scope = this;

        var createButton = function(value, id, handler) {

            new Ext.Button({
                text: value,
                iconCls: '',
                handler: handler,
                scope: scope
            }).render(document.body, id);
        };

        Ext.each(store.data.items, function(item) {

            var recordId = item.data.source;
            var elementId = 'download-button-' + recordId;
            var buttonHandler = function() { alert('button clicked (' + elementId + ')') };

            // Don't create button if no placeholder exists
            if (document.body.innerHTML.indexOf(elementId) != -1) {

                createButton.defer(1, null, ['Download as...', elementId, buttonHandler]);
            }
        });
    }
});
