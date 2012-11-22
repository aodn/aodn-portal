
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

    border: true,
    autoExpandColumn: 'mdDesc',

    initComponent: function() {
        var config = {
            colModel: new Ext.grid.ColumnModel({
                defaults: {
                    menuDisabled: true
                },
                columns: [
                    {
                        header: OpenLayers.i18n('logoHeading'),
                        width: 50,
                        xtype: 'templatecolumn',
                        tpl: '<img class="p-logo" src="'+Portal.app.config.catalogUrl+'/images/logos/{source}.gif"/>',
                        dataIndex: 'source'
                    },{
                        id: 'mdDesc',
                        header: OpenLayers.i18n('descHeading'),
                        dataIndex: 'title',
                        width: 150,
                        xtype: 'templatecolumn',
                        tpl: '<div style="white-space:normal !important;" title="{abstract}"><p>{title}</p></div>'
                    }
                ]
            }),
            bbar: new Ext.PagingToolbar({
                pageSize: 15
            })
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Portal.search.FacetedSearchResultsGrid.superclass.initComponent.apply(this, arguments);

        // TODO: Remove this HACK when proper paging service used - should bind the store not assign as below
        this.getBottomToolbar().store = this.store;

        this.addEvents('addlayer', 'rowenter', 'rowleave');
    },

    afterRender: function() {

        Portal.search.FacetedSearchResultsGrid.superclass.afterRender.call(this);

        this.loadMask = new Portal.common.LoadMask(this.el, {msg:"Searching..."});

        this.getView().mainBody.on({
            scope    : this,
            mouseover: this.onMouseOver,
            mouseout : this.onMouseOut
        });
    },

    showMask: function(){
        if (this.rendered) {
            this.loadMask.show();
        }
    },

    hideMask: function(){
        if (this.rendered) {
            this.loadMask.hide();
        }
    },

    // trigger mouseenter event on row when applicable
    onMouseOver : function(e, target) {
        var row = this.getView().findRow(target);
        if (row && row !== this.lastRow) {
            var rowIndex = this.getView().findRowIndex(row);
            this.fireEvent("mouseenter", this, rowIndex, this.store.getAt(rowIndex), e);
            this.lastRow = row;
        }
    },

    // trigger mouseleave event on row when applicable
    onMouseOut: function(e) {
        if (this.lastRow) {
            if(!e.within(this.lastRow, true, true)){
                var lastRowIndex = this.getView().findRowIndex(this.lastRow);
                this.fireEvent("mouseleave", this, lastRowIndex, this.store.getAt(lastRowIndex), e);
                delete this.lastRow;
            }
        }
    },

    onClick: function(e, target) {

        var row = this.getView().findRow(target);
        var rowIndex = this.getView().findRowIndex(row);

        Ext.MsgBus.publish( 'facetedSearch.layerSelected', this._getLayerLink(rowIndex) );
    },

    _getLayerLink: function(rowIndex) {

        var rec = this.store.getAt(rowIndex);
        var links = rec.get('links');
        var linkStore = new Portal.search.data.LinkStore({
            data: {links: links}
        });

        linkStore.filterByProtocols(Portal.app.config.metadataLayerProtocols);

        return linkStore.getLayerLink(0);
    }
});

Ext.reg('portal.search.facetedsearchresultsgrid', Portal.search.FacetedSearchResultsGrid);
