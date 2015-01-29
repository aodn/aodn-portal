/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.GeoSelectionPanel = Ext.extend(Ext.Panel, {
    padding:5,

    GEOMETRY_FIELD: 'geometry',

    constructor:function (cfg) {

        cfg = cfg || {};

        if (!cfg.separator)
            cfg.separator = "|";

        var defaults = {
            collapsible:true,
            collapsed:true,
            titleCollapse:true
        };

        Ext.apply(this, cfg, defaults);

        this.facetMap = new Portal.search.FacetMapPanel({
            initialBbox: Portal.app.appConfig.portal.initialBbox,
            mainMap: cfg.mapPanel,
            height: 250,
            width: 250
        });

        var config = Ext.apply({
            layout:'form',
            cls:'search-filter-panel term-selection-panel',
            items:[
                this.facetMap,
                new Ext.Container({
                    layout: 'hbox',
                    defaults: {
                        style: {
                            padding: '2px'
                        }
                    },
                    items: [  this.goButton = new Ext.Button({
                        text:OpenLayers.i18n("goButton"),
                        width:65
                    }),
                        this.clearButton = new Ext.Button({
                            text:OpenLayers.i18n("clearButton"),
                            width:65
                        })]
                })
            ]
        }, cfg, defaults);


        Portal.search.GeoSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.goButton, 'click', this.onGo, this);
        this.mon(this.clearButton, 'click', this.resetFilter, this);
        this.mon(this.facetMap, 'polygonadded', this._onPolygonAdded, this);
    },

    initComponent:function () {
        Portal.search.GeoSelectionPanel.superclass.initComponent.apply(this, arguments);
    },

    onGo:function () {
        this._removeFacetFilters();
        if (this.facetMap.hasCurrentFeature()) {
            this.searcher.addFilter(this.GEOMETRY_FIELD, this.facetMap.getBoundingPolygonAsWKT());
        }
        this.searcher.search();
        trackFacetUsage(this.titleText, OpenLayers.i18n('goButtonTrackingLabel'));
    },

    resetFilter: function() {
        this._clearFacetGeometry();
        this.onGo();
    },

    removeAnyFilters: function() {
        this._clearFacetGeometry();
        this._removeFacetFilters();
        this.collapse();
    },

    _removeFacetFilters: function() {
        this.searcher.removeFilters(this.GEOMETRY_FIELD);
    },

    _clearFacetGeometry: function() {
        this.facetMap.clearGeometry();
    },

    _onPolygonAdded: function() {
        this.searcher.fireEvent('polygonadded');
    }
});
