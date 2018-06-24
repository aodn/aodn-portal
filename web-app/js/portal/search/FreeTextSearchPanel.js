Ext.namespace('Portal.search');

Portal.search.FreeTextSearchPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        cfg = cfg || {};

        if (cfg.title) {
            cfg.title = '<span class="filter-selection-panel-header">' + cfg.title + '</span>';
        }

        var config = Ext.apply({
            cls: 'search-filter-panel filter-selection-panel free-text-search',
            collapsible: true,
            collapsed: cfg.collapsedByDefault,
            titleCollapse: true,
            items: [
                { xtype: 'spacer', height: 10 },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    cls: '',
                    items: [
                        { xtype: 'spacer', width: 10 },
                        this.searchField = new Ext.form.TextField({
                            width: 250,
                            focusClass: "focused",
                            emptyText: OpenLayers.i18n('freeTextFilterSearchHelperMsg'),
                            fieldLabel: 'Name',
                            enableKeyEvents: true
                        }),
                        { xtype: 'spacer', width: 7 },
                        new Ext.ux.Hyperlink({
                            text: '<span class=\"fa fa-search \" title=\"' + OpenLayers.i18n("freeTextSearchToolTip")+ '\"></span>',
                            iconCls: 'fa fa-lg',
                            tooltip: OpenLayers.i18n('searchFieldText'),
                            listeners: {
                                click: function() {
                                   this.onSearchIconClick();
                                },
                                scope: this
                            }
                        })
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
            trackUsabilityTest(OpenLayers.i18n('usabilityTestKeywordSubmitAction')
                , OpenLayers.i18n('usabilityTestKeywordGotFocusLabel'));
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
        trackFacetUsage(OpenLayers.i18n("keyword"), currentVal);
        this.searcher.search();
    },

    setCurrentFilter: function(currentVal) {
        if (currentVal != undefined && currentVal.length > 0) {
            this.currentFilterContainer.expand();
            this.resetLink.setText(OpenLayers.i18n("freeTextSearchClearButton", {val: this.searchField.getValue()}));
        }
        else {
            this.currentFilterContainer.collapse();
        }
    },

    onSearchChange: function(_field, event) {
        if (event.getKey() === event.ENTER) {
            if (this.searchField && this.searchField.isDirty()) {
                trackUsabilityTest(OpenLayers.i18n('usabilityTestKeywordSubmitAction')
                    , OpenLayers.i18n('usabilityTestKeywordEnterLabel'));
            }
            this.onGo();
        }
    },

    onSearchIconClick: function() {
        trackUsabilityTest(OpenLayers.i18n('usabilityTestKeywordSubmitAction')
                    , OpenLayers.i18n('usabilityTestKeywordMagnifierLabel'));
        this.onGo();
    },

    removeAnyFilters: function() {
        this.searchField.reset();
        this.searcher.removeFilters('any');
        this.currentFilterContainer.collapse();
    }
});
