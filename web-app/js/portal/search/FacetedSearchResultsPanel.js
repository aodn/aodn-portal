/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsPanel = Ext.extend(Ext.Panel, {

    initComponent:function () {

        this.pagingBar = new Ext.PagingToolbar({
            pageSize: this.searcher.pageSize,
            store: this.store,
            height: 40,
            autoLoad: true
        });

        this.dataView = new Portal.search.FacetedSearchResultsDataView({
            store: this.store,
            classificationStore: this.classificationStore
        });

        var config = {
            title: false,
            buttonAlign: 'left',
            fbar: this.pagingBar,
            width: 840,
            items: [
                this.dataView
            ]
        };

        Ext.apply(this, config);

        Portal.search.FacetedSearchResultsPanel.superclass.initComponent.apply(this, arguments);

        this.store.on('load', function() {
            this._onStoreLoad();
        }, this);

        this._subscribeToActiveGeoNetworkRecordStoreEvents();
    },

    _subscribeToActiveGeoNetworkRecordStoreEvents: function() {
        Ext4.each([PORTAL_EVENTS.DATA_COLLECTION_ADDED, PORTAL_EVENTS.DATA_COLLECTION_REMOVED], function(eventName) {

            Ext.MsgBus.subscribe(eventName, function() {
                this._refreshView();
            }, this);
        }, this);
    },

    _refreshView: function() {
        this.dataView.refresh();
    },

    _onStoreLoad: function() {
        // We want to reset scroll position to top on load, in case we were
        // previously not at the top.
        // Ref: https://github.com/aodn/aodn-portal/issues/464
        this._resetScrollPositionToTop();

        this.pagingBar.onLoad(
            this.store,
            null,
            {
                params: {
                    start: this.store.startRecord,
                    limit: 10
                }
            }
        );
    },

    _resetScrollPositionToTop: function() {
        this.body.dom.scrollTop = 0;
    }
});

Ext.reg('portal.search.facetedsearchresultspanel', Portal.search.FacetedSearchResultsPanel);
