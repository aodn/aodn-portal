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

    },

    afterRender: function () {
        Portal.search.FacetedSearchResultsGrid.superclass.afterRender.call(this);

        this.loadMask = new Portal.common.LoadMask(this.getView().mainBody, {
            msg: OpenLayers.i18n('maskText'),
            setTopPixels: 50
        });

        this.getView().mainBody.on({
            scope:this,
            mouseover:this.onMouseOver,
            mouseout:this.onMouseOut
        });
    },

    showMask: function () {
        if (this.rendered) {
            this.loadMask.show();
        }
    },

    hideMask: function () {
        if (this.rendered) {
            this.loadMask.hide();
        }
    },

    _getLayerLink: function (rowIndex) {

        var rec = this.store.getAt(rowIndex);
        var links = rec.get('links');
        var linkStore = new Portal.search.data.LinkStore({
            data:{links:links}
        });

        linkStore.filterByProtocols(Portal.app.config.metadataLayerProtocols);

            return linkStore.getLayerLink(0);
    },


    _showSearchResultsMessage: function(pages) {
        this.setTitle(null);
        this.hideHeaders = true;
        this.doLayout();
    },

    _showError: function() {
        this._setSpinnerText(OpenLayers.i18n('facetedSearchUnavailableText'));
        this.hideHeaders = false;
    },

    _setTitleText: function(newText) {
        this.setTitle( '<span class="x-panel-header-text">' + newText + '</span>' );
        this.doLayout();
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
