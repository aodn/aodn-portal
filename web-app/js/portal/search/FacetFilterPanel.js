/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetFilterPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        cfg = cfg || {};

        this.facetName = cfg.facetName;
        this.searcher = cfg.searcher;

        Ext.apply(cfg, {
            title: '<span class="filter-selection-panel-header">' + cfg.title + '</span>',
            containerScroll: true,
            autoScroll: true,
            collapsible: true,
            collapsed: cfg.collapsedByDefault,
            cls: "search-filter-panel filter-selection-panel"
        });

        Portal.search.FacetFilterPanel.superclass.constructor.call(this, cfg);

        this._addDrilldownPanel();
    },

    removeAnyFilters: function() {
        this._resetPanelDefaults();
        this._removeDrilldownPanels();
        this.searcher.removeDrilldownFilters(this.facetName);
        this._addDrilldownPanel();
        this.doLayout();
    },

    _resetPanelDefaults: function() {
        if (this.collapsedByDefault) {
            this.collapse();
        }
        else {
            this.expand();
        }
    },

    _addDrilldownPanel: function() {
        var drilldownPanel = new Portal.search.FacetDrilldownPanel({
            facetName: this.facetName,
            searcher: this.searcher
        });

        this.add(drilldownPanel);
        this.mon(drilldownPanel, 'drilldownchange', this._onDrilldownChange, this);

        return drilldownPanel;
    },

    _onDrilldownChange: function() {
        this.searcher.removeDrilldownFilters(this.facetName);
        this._addDrilldownFilters();
        this.searcher.search();
    },

    _addDrilldownFilters: function() {
        var drilldownPanels = this.findByType(Portal.search.FacetDrilldownPanel, true);

        Ext.each(drilldownPanels, function(drilldownPanel) {
            this.searcher.addDrilldownFilter(drilldownPanel.getDrilldownPath());
        }, this);
    },

    _removeDrilldownPanels: function() {
        this.removeAll();
    }

});
