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
            pageSize: 25,
            store: this.store,
            height: 40,
            autoLoad: true
        });

        this.dataView = new Portal.search.FacetedSearchResultsDataView({
            store: this.store
        })

        var config = {
            title: false,
            autoScroll: true,
            bodyCssClass: "faceted-search-results",
            buttonAlign: 'left',
            fbar: this.pagingBar,
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


    _viewButtonOnClick: function(btn) {

        btn.addClass("x-btn-selected");
        var uuid = btn.container.id.replace("fsSearchAddBtn",'');
        var record = this._getRecordFromUuid(uuid);

        if (!Portal.data.ActiveGeoNetworkRecordStore.instance().isRecordActive(record)) {
            Portal.data.ActiveGeoNetworkRecordStore.instance().add(record);
        }
        Ext.MsgBus.publish(PORTAL_EVENTS.VIEW_GEONETWORK_RECORD, record);
    },


    _subscribeToActiveGeoNetworkRecordStoreEvents: function() {
        Ext.each([PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_ADDED, PORTAL_EVENTS.ACTIVE_GEONETWORK_RECORD_REMOVED], function(eventName) {
            Ext.MsgBus.subscribe(eventName, function() {
                this._refreshView();
            }, this);
        }, this);
    },

    _refreshView: function() {
        if (this.dataView) {
            this.dataView.refresh();
            // todo set the scroll back to top
            //this.dataView.setPosition({ x: 0, y: 0 });
        }

    },

    afterRender: function () {
        Portal.search.FacetedSearchResultsPanel.superclass.afterRender.call(this);

        this.loadMask = new Portal.common.LoadMask(this.el, {
            msg: OpenLayers.i18n('maskText'),
            setTopPixels: 50
        });

    },

    showLoadMask: function () {
        if (this.rendered) {
            this.loadMask.showAtTop();
        }
    },

    hideLoadMask: function () {
        if (this.rendered) {
            this.loadMask.hide();
        }
    },

    _onStoreLoad: function() {

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
    }
});

Ext.reg('portal.search.facetedsearchresultspanel', Portal.search.FacetedSearchResultsPanel);
