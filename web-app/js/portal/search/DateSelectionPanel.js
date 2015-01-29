/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.search');

Portal.search.DateSelectionPanel = Ext.extend(Ext.Panel, {
    padding: 5,

    constructor: function (cfg) {
        cfg = cfg || {};

        if (!cfg.separator)
            cfg.separator = "|";

        var defaults = {
            collapsible: true,
            collapsed: true,
            titleCollapse: true
        };

        Ext.apply(this, cfg, defaults);

        var config = Ext.apply({
            layout: 'form',
            cls: 'search-filter-panel term-selection-panel',
            items: [
                this.dateRange = new Portal.search.field.FacetedDateRange(),

                // Add a container to store the go button and the clear button. Display horizontally
                new Ext.Container({
                    layout: 'hbox',
                    defaults: {
                        style: {
                            padding: '2px'
                        }
                    },
                    items: [ this.goButton = new Ext.Button({
                        text: OpenLayers.i18n("goButton"),
                        width: 65,
                        disabled: true
                        }),
                        this.clearButton = new Ext.Button({
                            text: OpenLayers.i18n("clearButton"),
                            width: 65
                        })]
                })
            ]
        }, cfg, defaults);

        Portal.search.DateSelectionPanel.superclass.constructor.call(this, config);

        this.mon(this.goButton, 'click', this.onGo, this);
        this.mon(this.clearButton, 'click', this.clearDateRange, this);
        this.mon(this.dateRange, 'valid', this._onValid, this);
        this.mon(this.dateRange, 'invalid', this._onInvalid, this);
    },

    initComponent:function () {
        Portal.search.DateSelectionPanel.superclass.initComponent.apply(this, arguments);
    },

    onGo: function() {
        var range = this.dateRange.getFilterValue();

        this.searcher.removeFilters("extFrom");
        this.searcher.removeFilters("extTo");

        var titleFrom = OpenLayers.i18n('min');
        var titleTo   = OpenLayers.i18n('max');

        if (range.fromDate !== "")
        {
            this.searcher.addFilter("extFrom", range.fromDate.format("Y-m-d"));
            titleFrom = range.fromDate.format("d/m/Y");
        }

        if (range.toDate !== "")
        {
            this.searcher.addFilter("extTo", range.toDate.format("Y-m-d"));
            titleTo = range.toDate.format("d/m/Y");
        }

        if (range.fromDate !== "" || range.toDate !== "")
        {
            var newSub = titleFrom + " - " + titleTo;
            this.setSelectedSubTitle(newSub);

            this.searcher.search();

            trackFacetUsage(this.titleText, OpenLayers.i18n('goButtonTrackingLabel'));
        }
    },

    clearDateRange: function() {
        this.dateRange.clearValues();
        this.removeSelectedSubTitle();
        this.goButton.disable();

        if (this.searcher.hasFilters()) {
            this.clearComponents();
            this.searcher.search();
        }
    },

    removeAnyFilters: function() {
        this.clearComponents();
        this.collapse();
        this.goButton.disable();
    },

    setSelectedSubTitle: function(subtitle) {
        var newTitle = '<span class="term-selection-panel-header-selected">' + this.titleText + '</span>';
        newTitle += " - " + subtitle;
        this.setTitle(newTitle);
    },

    removeSelectedSubTitle: function() {
        var newTitle = '<span class="term-selection-panel-header">' + this.titleText + '</span>';
        this.setTitle(newTitle);
    },

    clearComponents: function() {
        this.searcher.removeFilters("extFrom");
        this.searcher.removeFilters("extTo");
        this.dateRange.clearValues();
        this.removeSelectedSubTitle();
    },

    _onValid: function() {
        this.goButton.setDisabled(false);
    },

    _onInvalid: function() {
        this.goButton.setDisabled(true);
    }
});
