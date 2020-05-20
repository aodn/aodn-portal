Ext.namespace('Portal.search');

Portal.search.SortByPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        cfg = cfg || {};

        if (cfg.title) {
            cfg.title = '<span class="filter-selection-panel-header">' + cfg.title + '</span>';
        }

        var radioItems = [];
        const radioGroupId = Math.random().toString(36).substr(2);

        Ext.iterate(cfg.sortCriteria || {}, function(key, value) {
            radioItems.push( {
                boxLabel: value,
                name: radioGroupId,
                value: key,
                checked: key == "popularity"
            });
        });

        this.sortByRadioGroup = new Ext.form.RadioGroup({
            columns: 1,
            items: radioItems
        })

        var config = Ext.apply({
            cls: 'search-filter-panel filter-selection-panel sortByPanel',
            collapsible: false,
            titleCollapse: false,
            items: [
                { xtype: 'spacer', height: 10 },
                this.sortByRadioGroup,
                { xtype: 'spacer', height: 20 }

            ],
            toolTemplate: new Ext.Template('')
        }, cfg);

        Portal.search.SortByPanel.superclass.constructor.call(this, config);

        this.mon(this.sortByRadioGroup, 'change', this.onRadioChange, this);
    },

    initComponent: function() {
        Portal.search.SortByPanel.superclass.initComponent.apply(this, arguments);
    },

    onRadioChange: function(theRadioGroup, checkedItem) {
        this.searcher.setSortBy(checkedItem.value);
        trackFacetUsage(OpenLayers.i18n('searchCriteriaSortAction')
             , checkedItem.value);
    }

});
