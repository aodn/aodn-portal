Ext.namespace('Portal.search');

Portal.search.FacetFilterPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {

        cfg = cfg || {};

        this.facetName = cfg.facetName;
        this.searcher = cfg.searcher;

        Ext.apply(cfg, {
            title: cfg.title,
            containerScroll: true,
            autoScroll: true,
            collapsible: true,
            collapseFirst: false,
            titleCollapse: true,
            collapsed: cfg.collapsedByDefault,
            cls: "search-filter-panel filter-selection-panel",
            toolTemplate: new Ext.Template('<div class="x-tool-awesome fa fa-fw {styles}" title="{label}"></div>'),
            tools: [{
                id: 'plus',
                styles: 'fa-plus-square',
                handler: this._onAdd,
                scope: this,
                hidden: true,
                label: OpenLayers.i18n('addAnother')
            },
            {
                id: 'toggle',
                hidden: true
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
        this.on('expand', this._setAddButtonAvailability, this);
        this.on('collapse', this._setAddButtonAvailability, this);
        this.mon(this.searcher, 'searchcomplete', this._setAddButtonAvailability, this);
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
        if (!this.tools || !this.tools.plus) {
            return;
        }

        if (this._hasEmptyDrilldownPanel() || this._noDrilldownsAvailable() || this.collapsed) {
            this.tools.plus.disabled = true;
            this.tools.plus.hide();
        } else {
            this.tools.plus.disabled = false;
            this.tools.plus.show();
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
            if (drilldownPanel.hasDrilldown()) {
                this.searcher.addDrilldownFilter(drilldownPanel.getDrilldownPath());
            }
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
    },

    _noDrilldownsAvailable: function() {
        return !this._hasSelectableDrilldown(this.searcher.getFacetNode(this.facetName));
    },

    _hasSelectableDrilldown: function(node) {
        if (this.searcher.hasDrilldown(node.getHierarchy('value'))) {
            return false;
        }

        if (!node.hasChildNodes()) {
            return true;
        }

        var childWithSelectableDrilldown = node.findChildBy(function(child) {
            return this._hasSelectableDrilldown(child);
        }, this);

        return childWithSelectableDrilldown != null;
    }
});
