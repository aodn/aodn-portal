/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsGrid = Ext.extend(Ext.grid.GridPanel, {
    frame: false,
    layout: 'fit',
    border: false,
    autoExpandColumn: 'mdDesc',
    enableColumnResize: false,
    pageSize: 10,

    initComponent:function () {

        var selectionMod = new Ext.grid.RowSelectionModel({listeners:null});
        selectionMod.suspendEvents();

        var config = {
            hideHeaders: true,
            colModel: new Portal.search.FacetedSearchResultsColumnModel(),
            sm: selectionMod,
            stripeRows: false,
            trackMouseOver: false,
            bbar: new Ext.PagingToolbar({
                pageSize: this.pageSize,
                store: this.store
            }),
            listeners: {
                'rowmousedown': function(e) {
                    return false;
                }
            }
        };

        Ext.apply(this, config);

        Portal.search.FacetedSearchResultsGrid.superclass.initComponent.apply(this, arguments);

        this.store.on('load', function() {
            this._onStoreLoad();
        }, this);

        this._subscribeToActiveGeoNetworkRecordStoreEvents();
    },

    _subscribeToActiveGeoNetworkRecordStoreEvents: function() {
        Ext.each(['activegeonetworkrecordadded', 'activegeonetworkrecordremoved'], function(eventName) {
            Ext.MsgBus.subscribe(eventName, function() {
                this._refreshView();
            }, this);
        }, this);
    },

    _refreshView: function() {
        if (this.view) {
            this.view.refresh();
        }
    },

    afterRender: function () {
        Portal.search.FacetedSearchResultsGrid.superclass.afterRender.call(this);

        this.loadMask = new Portal.common.LoadMask(this.getView().mainBody, {
            msg: OpenLayers.i18n('maskText'),
            setTopPixels: 50
        });
    },

    showMask: function () {
        if (this.rendered) {
            this.loadMask.showAtTop();
        }
    },

    _onStoreLoad: function() {
        this.getBottomToolbar().onLoad(
            this.store,
            null,
            {
                params: {
                    start: this.store.startRecord,
                    limit: 10
                }
            }
        );
    }
});

Ext.reg('portal.search.facetedsearchresultsgrid', Portal.search.FacetedSearchResultsGrid);
