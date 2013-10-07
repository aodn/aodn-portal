
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.LayerGridPanel = Ext.extend(Ext.grid.GridPanel, {

    constructor: function(cfg) {
        var store = new Portal.data.LayerDataPanelStore({url: cfg.url});
        var config = Ext.apply({
            title: OpenLayers.i18n('dragLayersOrServers'),
            height: 500,
            width: 600,
            stripeRows: true,
            enableDragDrop: true,
            ddGroup: 'layerGridPanel',
            columns: [
                { header: "Title", sortable: true, dataIndex: 'title' },
                { header: "WMS Server Layer Name", sortable: true, dataIndex: 'name' },
                { header: "Base Layer", sortable: true, dataIndex: 'isBaseLayer' }
            ],
            store: store,
            viewConfig: {
                forceFit: true,
                groupTextTpl: 'text ',
                getRowClass: function(record, index) {
                    if (record.json['class'] == "au.org.emii.portal.Server") {
                        return 'serverRow';
                    }
                    else {
                        return 'layerRow';
                    }
                }
            },
            bbar: new Ext.PagingToolbar({
                store: store,
                displayInfo: true,
                pageSize: 50
            })
        }, cfg);

        Portal.ui.LayerGridPanel.superclass.constructor.call(this, config);
    },

    onFormSubmit: function(filter) {
        this.store.baseParams = { phrase: filter }
        this.store.load({ params: { start: 0, limit: 50 } });
        this.doLayout();
    }
});

Portal.ui.LayerSearchPanel = Ext.extend(Ext.FormPanel, {

    filterHandler: undefined,

    constructor: function(cfg) {
        this.filterHandler = cfg.filterHandler;
        var config = Ext.apply({
            frame: true,
            border: false,
            buttonAlign: 'center',
            url: jsonLayers,
            method: 'POST',
            id: 'layerSearchPanel',
            bodyStyle: 'padding:1px;',
            width: 600,
            layout: 'hbox',
            items: [
                {
                    xtype: 'textfield',
                    width: 480,
                    id: 'gridFilterPhrase',
                    fieldLabel: 'Filter',
                    name: 'phrase',
                    ref: 'phrase'
                },
                {
                    xtype: 'button',
                    text: 'Reset',
                    width: 50,
                    ref: 'resetButton'
                },
                {
                    xtype: 'button',
                    text: 'Filter',
                    width: 50,
                    ref: 'filterButton'
                }
            ],
            keys: [{
                key: [Ext.EventObject.ENTER],
                scope: this,
                handler: function() {
                    this.filterButton.fireEvent('click');
                }
            }]
        });

        Portal.ui.LayerSearchPanel.superclass.constructor.call(this, config);
    },

    getPhrase: function() {
        return this.phrase.getValue();
    },

    formReset: function() {
        this.getForm().reset();
    }

});

Portal.ui.LayerDataPanel = Ext.extend(Ext.Panel, {

    grid: undefined,
    filter: undefined,

    constructor: function(cfg) {

        this.grid = new Portal.ui.LayerGridPanel(cfg);
        this.filter = new Portal.ui.LayerSearchPanel({ filterHandler: this.grid.onFormSubmit });

        var config = Ext.apply({
            width: 600,
            items: [
                this.grid,
                this.filter
            ]
        }, cfg);

        Portal.ui.LayerDataPanel.superclass.constructor.call(this, config);

        this.filter.filterButton.on('click', function() {
            this.grid.onFormSubmit(this.filter.getPhrase());
        }, this);

        this.filter.resetButton.on('click', function() {
            this.filter.formReset();
            this.grid.onFormSubmit();
        }, this);
    }
});
