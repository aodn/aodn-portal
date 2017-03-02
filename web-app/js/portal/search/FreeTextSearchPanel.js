Ext.namespace('Portal.search');

Portal.search.FreeTextSearchPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        cfg = cfg || {};

        cfg.title = undefined;

        var config = Ext.apply({
            cls: 'search-filter-panel filter-selection-panel free-text-search',
            items: [
                {
                    xtype: 'container',
                    layout: 'hbox',
                    cls: '',
                    items: [
                        {
                            html: '<span class=\"fa fa-search \"></span>',
                            cls: 'fa fa-2x'
                        },
                        { xtype: 'spacer', width: 10 },
                        this.searchField = new Ext.form.TextField({
                            width: 250,
                            focusClass: "focused",
                            emptyText: OpenLayers.i18n('freeTextFilterSearchHelperMsg'),
                            fieldLabel: 'Name',
                            enableKeyEvents: true
                        }),
                        { xtype: 'spacer', width: 10 }
                    ]
                },
                { xtype: 'spacer', height: 10 },
                this.currentFilterContainer = new Ext.Panel({
                    layout: 'hbox',
                    collapsible: true,
                    preventHeader: true,
                    hideCollapseTool: true,
                    cls: '',
                    items: [
                        { xtype: 'spacer', width: 35 },
                        this.resetLink = new Ext.ux.Hyperlink()
                    ]
                })
            ],
            toolTemplate: new Ext.Template('')
        }, cfg);

        Portal.search.FreeTextSearchPanel.superclass.constructor.call(this, config);

        this.mon(this.searchField, 'keyup', this.onSearchChange, this);

        this.resetLink.on('click', function() {
            this.removeAnyFilters();
            this.onGo();
        }, this);

        this.searchField.on('render', function() {
            this.searchField.reset();
            this.currentFilterContainer.collapse();
        }, this);

        this.searchField.on('focus', function() {
                this.searchField.reset();
        }, this);
    },

    initComponent: function() {
        Portal.search.FreeTextSearchPanel.superclass.initComponent.apply(this, arguments);
    },

    onGo: function() {
        var currentVal = this.searchField.getRawValue().toLowerCase();
        this.searcher.removeFilters('any');
        this.searcher.addFilter('any', currentVal);
        this.setCurrentFilter(currentVal);
        trackFacetUsage(this.facetName, currentVal);
        this.searcher.search();
    },

    setCurrentFilter: function(currentVal) {
        if (currentVal != undefined && currentVal.length > 0) {
            this.currentFilterContainer.expand();
            this.resetLink.setText(OpenLayers.i18n("freeTextSearchClearButton", {val: this.searchField.getValue()}));
        }
        else {
            this.currentFilterContainer.collapse();
            this.searchField.reset();
        }
    },

    onSearchChange: function(_field, event) {
        if (event.getKey() === event.ENTER) {
            this.onGo();
        }
    },

    removeAnyFilters: function() {
        this.searchField.reset();
        this.searcher.removeFilters('any');
        this.currentFilterContainer.collapse();
    }
});
