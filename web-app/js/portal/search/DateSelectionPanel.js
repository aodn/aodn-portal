/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.DateSelectionPanel = Ext.extend(Ext.Panel, {

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

        var config = Ext.apply({
            layout:'form',
            cls:'search-filter-panel term-selection-panel',
            items:[
                this.dateRange = new Portal.search.field.FacetedDateRange(),
                this.searchButton = new Ext.Button({
                    text: OpenLayers.i18n("searchButton"),
                    width: 65
                })
            ]
        }, cfg, defaults);


        Portal.search.DateSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.searchButton, 'click', this.onSearch, this);

//        this.mon(this.searcher, 'searchcomplete', this._loadStore, this);
//        this.mon(this.searcher, 'summaryOnlySearchComplete', this._loadStore, this);
//        this.mon(this.searcher, 'searcherror', this._searchFail, this);
    },

    initComponent:function () {
        Portal.search.DateSelectionPanel.superclass.initComponent.apply(this, arguments);
    },

    onSearch: function() {
        var range = this.dateRange.getFilterValue();

        this.searcher.removeFilters("extFrom");
        this.searcher.removeFilters("extTo");

        var titleFrom = "Min";
        var titleTo = "Max";

        if (range.fromDate !== "")
        {
            this.searcher.addFilter("extFrom", range.fromDate);
            titleFrom = range.fromDate.format("d/m/Y");
        }

        if (range.toDate !== "")
        {
            this.searcher.addFilter("extTo", range.toDate);
            titleTo = range.toDate.format("d/m/Y");
        }

        if(range.fromDate !== "" || range.toDate !== "")
        {
            var newSub = titleFrom + " - " + titleTo;
            this.setSelectedSubTitle(newSub);

            this.searcher.search();
        }
    },

    removeAnyFilters: function() {
        this.searcher.removeFilters("extFrom");
        this.searcher.removeFilters("extTo");
        this.dateRange.clearValues();
        this.removeSelectedSubTitle();
        this.collapse();
    },

    setSelectedSubTitle: function(subtitle) {
        var newTitle = '<span class="term-selection-panel-header-selected">' + this.titleText + '</span>';
        newTitle += " - " + subtitle;
        this.setTitle(newTitle);
    },

    removeSelectedSubTitle: function() {
        var newTitle = '<span class="term-selection-panel-header">' + this.titleText + '</span>';
        this.setTitle(newTitle);
    }
});
