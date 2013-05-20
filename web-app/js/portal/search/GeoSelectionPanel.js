/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.GeoSelectionPanel = Ext.extend(Ext.Panel, {
    padding:5,

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
        var radios = [
            new Ext.form.Radio({name:"mapSelectionRadio", fieldLabel:"Navigate", checked:true,
                listeners:{check:{
                    fn:function(radio,checked) {
                        if(checked) {
                            this.facetMap.switchToNavigation();
                        }
                    },
                    scope:this
                }}}),

            new Ext.form.Radio({name:"mapSelectionRadio", fieldLabel:"Box",
                listeners:{check:{
                    fn:function(radio,checked) {
                        if(checked) {
                            this.facetMap.switchToBoxDrawer();
                        }
                    },
                    scope:this
                }}}),
            new Ext.form.Radio({name:"mapSelectionRadio", fieldLabel:"Custom",
                listeners:{check:{
                    fn:function(radio,checked) {
                        if(checked) {
                            this.facetMap.switchToPolygonDrawer();
                        }
                    },
                    scope:this
                }}})
        ]

        var config = Ext.apply({
            layout:'form',
            cls:'search-filter-panel term-selection-panel',
            items:[
                radios,
                this.facetMap,
                new Ext.Container({
                    layout: 'hbox',
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
        this.mon(this.clearButton, 'click', function() {this.facetMap.clearGeometry()}, this);
    },

    initComponent:function () {
        Portal.search.GeoSelectionPanel.superclass.initComponent.apply(this, arguments);
    },

    onSearch:function () {

    },

    removeAnyFilters: function() {
        this.facetMap.clearGeometry();
    }

});
