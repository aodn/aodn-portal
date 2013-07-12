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

        if (cfg.title) cfg.title = '<span class="term-selection-panel-header">' + cfg.title + '</span>';

        if (!cfg.separator)
            cfg.separator = "|";

        var defaults = {
            collapsible:true,
            collapsed:true,
            titleCollapse:true
        };

        Ext.apply(this, cfg, defaults);

        this.facetMap = new Portal.search.FacetMapPanel({
            initialBbox:Portal.app.config.initialBbox,
            mainMap:Ext.getCmp("mainMapPanel"),
            height:250,
            width:250
        });

        this.facetMap.switchToNavigation();

        this.radioStatus = new Ext.Panel({
            html: "<h4>" +  OpenLayers.i18n('geoSelectionPanelHelp') + "</h4>"
        });
        var radios = [
            new Ext.form.Radio({
                name:"mapSelectionRadio",
                fieldLabel: OpenLayers.i18n('navigate'),
                itemCls: "small",
                checked:false,
                listeners:{check:{
                    fn:function(radio,checked) {
                        if(checked) {
                            this.facetMap.switchToNavigation();
                            this._updateRadioStatus('navigate');
                        }
                    },
                    scope:this
                }}}),

            new Ext.form.Radio({
                name:"mapSelectionRadio",
                fieldLabel: OpenLayers.i18n('box'),
                itemCls: "small",
                listeners:{check:{
                    fn:function(radio,checked) {
                        if(checked) {
                            this.facetMap.switchToBoxDrawer();
                            this._updateRadioStatus('box');
                        }
                    },
                    scope:this
                }}}),
            new Ext.form.Radio({
                name:"mapSelectionRadio",
                fieldLabel: OpenLayers.i18n('polygon'),
                itemCls: "small",
                listeners:{check:{
                    fn:function(radio,checked) {
                        if(checked) {
                            this.facetMap.switchToPolygonDrawer();
                            this._updateRadioStatus('polygon');
                        }
                    },
                    scope:this
                }}})
        ];


        var config = Ext.apply({
            layout:'form',
            cls:'search-filter-panel term-selection-panel',
            items:[
                new Ext.Container({
                    layout: 'hbox',
                    margins: {top:0, right:10, bottom:0, left:0},
                    defaults: {
                        style: {
                            padding: '6px'
                        }
                    },
                    items:[
                        {
                            layout: 'form',
                            items: [radios]
                        },
                        this.radioStatus
                    ]
                }),
                this.facetMap,
                new Ext.Container({
                    layout: 'hbox',
                    defaults: {
                        style: {
                            padding: '2px'
                        }
                    },
                    items: [  this.searchButton = new Ext.Button({
                        text:OpenLayers.i18n("searchButton"),
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

        this.mon(this.searchButton, 'click', this.onSearch, this);
        this.mon(this.clearButton, 'click', this.resetFilter, this);
    },

    initComponent:function () {
        Portal.search.GeoSelectionPanel.superclass.initComponent.apply(this, arguments);
    },

    onSearch:function () {
        this.removeAnyFilters();
        if (this.facetMap.hasCurrentFeature()) {
            this.searcher.addFilter(this.GEOMETRY_FIELD, this.facetMap.getBoundingPolygonAsWKT());
        }
        this.searcher.search();
    },

    _updateRadioStatus:function (comp) {
        this.radioStatus.update("<h4>" + OpenLayers.i18n(comp + 'Help') + "</h4>");
    },

    resetFilter: function() {
        this.facetMap.clearGeometry();
        this.onSearch();
    },

    removeAnyFilters: function() {
        this.searcher.removeFilters(this.GEOMETRY_FIELD);
    }

});
