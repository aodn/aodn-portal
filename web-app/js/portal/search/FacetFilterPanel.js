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
            collapseFirst: false,
            collapsed: cfg.collapsedByDefault,
            cls: "search-filter-panel filter-selection-panel",
            toolTemplate: new Ext.Template('<div class="x-tool x-tool-{id}" title="{title}">&#160;</div>'),
            tools: [{
                id: 'plus',
                handler: this._onAdd,
                scope: this,
                title: OpenLayers.i18n('addAnother')
            }]
        });

        Portal.search.FacetFilterPanel.superclass.constructor.call(this, cfg);

        this._addDrilldownPanel();

        this._registerHandlers();
    },

    removeAnyFilters: function() {
        this._resetPanelDefaults();
        this._removeDrilldownPanels();
        this.searcher.removeDrilldownFilters(this.facetName);
        this._addDrilldownPanel();
        this.doLayout();
    },

    setSelectedDrilldown: function(drilldown, categories) {
        var drilldownPanel = this._getDrilldownPanels()[drilldown];
        drilldownPanel.setSelectedDrilldown(categories);
    },

    clearDrilldown: function(drilldown) {
        var drilldownPanel = this._getDrilldownPanels()[drilldown];
        drilldownPanel.clearDrilldown();
    },

    _registerHandlers: function() {
        this.on('afterlayout', this._setAddButtonAvailability, this);
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

    _onDrilldownChange: function(drilldownPanel) {
        if (drilldownPanel.hasNoDrilldown() && this._hasOtherDrilldownPanels()) {
            this.remove(drilldownPanel);
        }
        this._setAddButtonAvailability();
        this.searcher.removeDrilldownFilters(this.facetName);
        this._addDrilldownFilters();
        this.searcher.search();
    },

    _hasOtherDrilldownPanels: function() {
        return this.items.length > 1;
    },

    _setAddButtonAvailability: function() {
        if (this._hasEmptyDrilldownPanel()) {
            this.tools.plus.disabled = true;
            this.tools.plus.addClass('tool-plus-disabled');
        } else {
            this.tools.plus.disabled = false;
            this.tools.plus.removeClass('tool-plus-disabled');
        }
    },

    _hasEmptyDrilldownPanel: function() {
        var result = false;

        Ext.each(this._getDrilldownPanels(), function(drilldownPanel) {
            if (drilldownPanel.hasNoDrilldown()) {
                result = true;
                return false;
            }
        }, this);

        return result;
    },

    _addDrilldownFilters: function() {
        Ext.each(this._getDrilldownPanels(), function(drilldownPanel) {
            this.searcher.addDrilldownFilter(drilldownPanel.getDrilldownPath());
        }, this);
    },

    _removeDrilldownPanels: function() {
        this.removeAll();
    },

    _getDrilldownPanels: function() {
        return this.findByType(Portal.search.FacetDrilldownPanel, true);
    },

    _onAdd: function() {
        if (this.tools.plus.disabled) {
            return;
        }

        this._addDrilldownPanel();
        this.doLayout();
    }
});
