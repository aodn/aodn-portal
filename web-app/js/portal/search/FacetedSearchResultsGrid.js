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
    mapWidth: 400,
    mapHeight: 208,

    initComponent:function () {
        var config = {
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
            bbar:new Ext.PagingToolbar({
                pageSize:this.pageSize
            })
        };

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        Portal.search.FacetedSearchResultsGrid.superclass.initComponent.apply(this, arguments);

        // TODO: Remove this HACK when proper paging service used - should bind the store not assign as below
        this.getBottomToolbar().store = this.store;

        this.addEvents('rowenter', 'rowleave');
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

    _viewButtonOnClick: function(button, e, rowIndex) {
        var layerLink = this._getLayerLink(rowIndex);
        if (layerLink) {
            Ext.MsgBus.publish('addLayerUsingLayerLink', layerLink);
            setViewPortTab(TAB_INDEX_MAP);
        }
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
        var bbox = record.get('bbox');
        var map = new OpenLayers.Map({
            controls: [],
            minExtent: new OpenLayers.Bounds(-1, -1, 1, 1),
            maxExtent: new OpenLayers.Bounds(-180, -90, 180, 90) }
        );
        map.addLayer(this._baseLayer());
        map.addLayer(this._boundingBoxLayer(bbox));


        setTimeout(function() {
            map.render(componentId);
            var bounds = new OpenLayers.Bounds(bbox.west, bbox.south, bbox.east, bbox.north);
            map.setCenter(bounds.getCenterLonLat(), me._zoomLevel(map, bounds));
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
    },

    _boundingBoxLayer: function(bbox) {
        var boundingBoxLayer = new OpenLayers.Layer.Vector("Metadata Bounding Box");
        boundingBoxLayer.addFeatures(this._vectorFeatures(bbox));

        return boundingBoxLayer;
    },

    _boundingBoxPoints: function(bbox) {
        return [
            this._point(bbox.east, bbox.south),
            this._point(bbox.east, bbox.north),
            this._point(bbox.west, bbox.north),
            this._point(bbox.west, bbox.south)
        ]
    },

    _point: function(x, y) {
        return new OpenLayers.Geometry.Point(x, y);
    },

    _vectorFeatures: function(bbox) {
        return [new OpenLayers.Feature.Vector(this._boundingBoxPolygon(bbox))];
    },

    _boundingBoxPolygon: function(bbox) {
        return new OpenLayers.Geometry.Polygon(this._boundingBoxLinearRings(bbox));
    },

    _boundingBoxLinearRings: function(bbox) {
        return [new OpenLayers.Geometry.LinearRing(this._boundingBoxPoints(bbox))];
    }
});

Ext.reg('portal.search.facetedsearchresultsgrid', Portal.search.FacetedSearchResultsGrid);
