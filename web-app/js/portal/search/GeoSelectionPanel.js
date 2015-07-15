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

        this.titleText = cfg.title;

        if (cfg.title) cfg.title = '<span class="filter-selection-panel-header">' + cfg.title + '</span>';

        if (!cfg.separator)
            cfg.separator = "|";

        var defaults = {
        };

        Ext4.apply(this, cfg, defaults);

        this.facetMap = new Portal.search.FacetMapPanel({
            initialBbox: Portal.app.appConfig.portal.initialBbox,
            mainMap: cfg.mapPanel,
            height: 280,
            width: 300
        });

        var config = Ext4.apply({
            layout: 'form',
            cls: 'search-filter-panel filter-selection-panel',
            defaults: {
                style: {
                    margin: '2px'
                }
            },
            collapsible: true,
            collapsed: true,
            titleCollapse: true,
            toolTemplate: new Ext.Template(''),
            items:[
                this.facetMap,
                new Ext.Spacer({
                    height: 4
                }),
                new Ext.Container({
                    layout: 'hbox',
                    items: [
                        this.goButton = new Ext.Button({
                            text:OpenLayers.i18n("goButton")
                        }),
                        new Ext.Spacer({
                            width: 4
                        }),
                        this.clearButton = new Ext.Button({
                            text:OpenLayers.i18n("clearButton")
                        })
                    ]
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
