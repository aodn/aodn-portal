Ext.namespace('Portal.search');

Portal.search.SortByPanel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        cfg = cfg || {};

        if (cfg.title) {
            this.originalTitle =  cfg.title;
            cfg.title = this.buildTitle( cfg.title, "Default");
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
        });

        var config = Ext.apply({
            cls: 'sortByPanel',
            collapsible: true,
            collapsed: true,
            titleCollapse: true,
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

    updateTitle: function(selectedKey) {
        this.setTitle(this.buildTitle(this.originalTitle,selectedKey));

    },

    buildTitle: function(title,selectedKey) {
         return String.format('<span class="filter-selection-panel-header">{0}: <span class="sortByPanelButton">{1}</span></span>', title, selectedKey)
    },

    removeAnyFilters: function() {
        return true;
    },

    initComponent: function() {
        Portal.search.SortByPanel.superclass.initComponent.apply(this, arguments);

    },

    onRadioChange: function(theRadioGroup, checkedItem) {
        this.searcher.setSortBy(checkedItem.value);
        this.updateTitle(checkedItem.boxLabel);
        this.collapse();
        trackFacetUsage(OpenLayers.i18n('searchCriteriaSortAction')
             , checkedItem.value);
    }

});
