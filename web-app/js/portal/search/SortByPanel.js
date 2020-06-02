Ext.namespace('Portal.search');

Portal.search.SortByPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        cfg = cfg || {};

        if (cfg.title) {
            this.originalTitle =  cfg.title;
            cfg.title = this.buildTitle( cfg.title, "Default");
        }

        var toolItems = [];

        for ( var key in cfg.sortCriteria ) {
            toolItems.push( new Ext.Button({
                id: key,
                value: cfg.sortCriteria[key],
                handler: this._onSelectSortCriteria,
                scope: this,
                styles: (key == "popularity") ? 'sortByPanelButton selected': 'sortByPanelButton'
            }));
        }
        toolItems.reverse();

        this.sortByAsc = new Ext.Button({
            id: 'asc',
            styles: 'fa x-tool-awesome awesome-button fa-sort-amount-asc selected',
            handler: this._onSelect,
            scope: this,
            label: OpenLayers.i18n('asc')
        });

        this.sortByDesc = new Ext.Button({
            id: 'desc',
            styles: 'fa x-tool-awesome awesome-button fa-sort-amount-desc ',
            handler: this._onSelect,
            scope: this,
            label: OpenLayers.i18n('desc')
        });
        toolItems.push(this.sortByAsc);
        toolItems.push(this.sortByDesc);

        var config = Ext.apply({
            cls: 'sortByPanel',
            collapsible: false,
            collapsed: true,
            toolTemplate: new Ext.Template('<div class="{styles} " title="{label}">{value}</div>'),
            tools: toolItems
        }, cfg);

        Portal.search.SortByPanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {
        Portal.search.SortByPanel.superclass.initComponent.apply(this, arguments);
    },

    _onSelectSortCriteria: function(evt, item) {

        jQuery('.sortByPanelButton').removeClass("selected");
        item.addClass("selected");
        Ext.iterate(this.tools, function(val) {
            if (this.tools[val].id == item.id) {
                this.searcher.setSortBy(val);
                trackFacetUsage(OpenLayers.i18n('searchCriteriaSortAction'), val);
            }
        }, this);
    },

    _onSelect: function(evt, item) {
        jQuery('.awesome-button').removeClass("selected");
        item.addClass("selected");
        Ext.iterate(this.tools, function(value) {
            if (this.tools[value].id == item.id) {
                this.searcher.selectedSortOrder = value;
            }
        }, this);
        this.searcher.search();
    },

    buildTitle: function(title,selectedKey) {
         return String.format('<span class="filter-selection-panel-header">{0}</span>', title)
    },

    removeAnyFilters: function() {
        return true;
    }
});
