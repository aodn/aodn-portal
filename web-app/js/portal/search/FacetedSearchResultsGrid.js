/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchResultsGrid = Ext.extend(Ext.grid.GridPanel, {
    frame:false,
    layout:'fit',
    border:false,
    autoExpandColumn: 'mdDesc',
    enableColumnResize: false,
    mapWidth: 200,
    mapHeight: 104,

    initComponent:function () {

        var selectionMod = new Ext.grid.RowSelectionModel({listeners:null})
        selectionMod.suspendEvents();

        var config = {
            title: "Search Results",
            headerCfg: {
                cls: 'x-panel-header p-header-space'
            },
            colModel:new Ext.grid.ColumnModel({
                defaults:{
                    menuDisabled:true
                },
                columns:[
                    {
                        header: '',
                        width: this.mapWidth,
                        height: this.mapHeight,
                        renderer: this._miniMapRenderer,
                        scope: this
                    },
                    {
                        id:'mdDesc',
                        header:OpenLayers.i18n('descHeading'),
                        dataIndex:'title',
                        xtype:'templatecolumn',
                        tpl:'<div style="white-space:normal !important;" title="{abstract}"><p>{title}</p></div>'
                    },
                    {
                        header: '',
                        renderer: this._viewButtonRenderer,
                        scope: this
                    }
                ]
            }),
            sm: selectionMod,
            stripeRows: false,
            trackMouseOver: false,
            bbar:new Ext.PagingToolbar({
                pageSize:this.pageSize,
                store: this.store
            }),
            listeners: {
                'rowmousedown': function(evt) {
                    Ext.preventDefault(evt);
                }
            }
        };

        Ext.apply(this, config);

        Portal.search.FacetedSearchResultsGrid.superclass.initComponent.apply(this, arguments);

    },

    afterRender:function () {
        Portal.search.FacetedSearchResultsGrid.superclass.afterRender.call(this);

        this.loadMask = new Portal.common.LoadMask(this.el, {msg:"Searching..."});
        this.getView().mainBody.on({
            scope:this,
            mouseover:this.onMouseOver,
            mouseout:this.onMouseOut
        });
    },

    showMask:function () {
        if (this.rendered) {
            this.loadMask.show();
        }
    },

    hideMask:function () {
        if (this.rendered) {
            this.loadMask.hide();
        }
    },

    // trigger mouseenter event on row when applicable
    onMouseOver:function (e, target) {
        var row = this.getView().findRow(target);
        if (row && row !== this.lastRow) {
            var rowIndex = this.getView().findRowIndex(row);
            this.fireEvent("mouseenter", this, rowIndex, this.store.getAt(rowIndex), e);
            this.lastRow = row;
        }
    },

    // trigger mouseleave event on row when applicable
    onMouseOut:function (e) {
        if (this.lastRow) {
            if (!e.within(this.lastRow, true, true)) {
                var lastRowIndex = this.getView().findRowIndex(this.lastRow);
                this.fireEvent("mouseleave", this, lastRowIndex, this.store.getAt(lastRowIndex), e);
                delete this.lastRow;
            }
        }
    },

    _getLayerLink:function (rowIndex) {

        var rec = this.store.getAt(rowIndex);
        var links = rec.get('links');
        var linkStore = new Portal.search.data.LinkStore({
            data:{links:links}
        });

        linkStore.filterByProtocols(Portal.app.config.metadataLayerProtocols);

        return linkStore.getLayerLink(0);
    },

    _showIntroMessage: function() {
        this._setTitleText( OpenLayers.i18n('facetedSearchStartResultsTitle'));
    },
    _showSearchResultsMessage: function(pages) {
        this.setTitle(null);
        this.hideHeaders = true
        this.doLayout();
    },
    _showError: function() {
        this._setTitleText(OpenLayers.i18n('facetedSearchUnavailableText'));
    },

    _setTitleText: function(newText) {
        this.setTitle( '<span class="x-panel-header-text">' + newText + '</span>' );
        //tb.doLayout();
    },

    _viewButtonOnClick: function(button, e, rowIndex) {
        var geoNetworkRecord = this.store.getAt(rowIndex);
        Portal.data.ActiveGeoNetworkRecordStore.instance().add(geoNetworkRecord);
    },

    _viewButtonRenderer: function(value, metaData, record, rowIndex) {

        var grid = this;

        var createButton = function(value, id, record, handler) {
            new Ext.Button({
                text: value,
                iconCls: '',
                handler: handler,
                scope: grid
            }).render(document.body, id);
        };

        var componentId = Ext.id();
        var buttonHandler = function(button, e) {
            this._viewButtonOnClick(button, e, rowIndex);
        };
        createButton.defer(1, this, ['View', componentId, record, buttonHandler]);

        return('<div id="' + componentId + '"></div>');
    },

    _miniMapRenderer: function(value, metaData, record, rowIndex) {
        var me = this;
        var componentId = Ext.id();
        var metadataExtent = record.get('bbox');
        var map = new OpenLayers.Map({
            controls: []
        });
        map.addLayer(this._baseLayer());
        map.addLayer(metadataExtent.getLayer());

        setTimeout(function() {
            map.render(componentId);
            if (metadataExtent.getBounds()) {
                map.setCenter(metadataExtent.getBounds().getCenterLonLat(), me._zoomLevel(map, metadataExtent.getBounds()));
            }
        }, 10);

        return('<div id="' + componentId + '" style="width: ' + this.mapWidth + '; height: ' + this.mapHeight + ';"></div>');
    },

    _baseLayer: function() {
        return new OpenLayers.Layer.WMS(
            "IMOS Tile Cache Simple Baselayer",
            "http://tilecache.emii.org.au/cgi-bin/tilecache.cgi/1.0.0/",
            { layers: 'default_basemap_simple' }
        );
    },

    _zoomLevel: function(map, bounds) {
        var zoomLevel = map.getZoomForExtent(bounds);
        if (zoomLevel == 0) {
            // 0 is too large
            zoomLevel = 1;
        }
        else if (zoomLevel > 4) {
            // Anything over 4 doesn't show enough to get an idea of where things are
            zoomLevel = 4;
        }
        return zoomLevel;
    }
});

Ext.reg('portal.search.facetedsearchresultsgrid', Portal.search.FacetedSearchResultsGrid);
