Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchFiltersPanel = Ext.extend(Ext.Panel, {

	constructor: function(config) {

		this.themeFilter = new Portal.ui.TermSelectionPanel({
			title: OpenLayers.i18n('themeFilter'),
			hierarchical: true,
			fieldName: 'Gcmd538',
			searcher: config.searcher
		});

		this.methodFilter = new Portal.ui.TermSelectionPanel({
			title: OpenLayers.i18n('methodFilter'),
			hierarchical: true,
			fieldName: 'Mcp14Cmv',
			searcher: config.searcher
		});

		this.locationFilter = new Portal.ui.TermSelectionPanel({
			title: OpenLayers.i18n('locationFilter'),
			hierarchical: true,
			fieldName: 'Mcp14Gev',
			searcher: config.searcher
		});

		this.organisationFilter = new Portal.ui.TermSelectionPanel({
			title: OpenLayers.i18n('organisationFilter'),
			hierarchical: false,
			fieldGroup: 'organisationNames',
			fieldName: 'orgName',
			searcher: config.searcher
		});

		this.parameterFilter = new Portal.ui.TermSelectionPanel({
			title: OpenLayers.i18n('parameterFilter'),
			hierarchical: false,
			fieldGroup: 'longParamNames',
			fieldName: 'longParamName',
			searcher: config.searcher
		});

//		this.boundingBoxFilter = new Portal.search.field.BoundingBox({
//            title: '<span class="term-selection-panel-header">' + OpenLayers.i18n('boundingBox') + '</span>',
//            collapsed: true,
//            collapsible: true,
//            padding: 3,
//            cls: 'term-selection-panel' // Todo - DN: Class could be named more appropriately
//		});

		config = Ext.apply({
	        layout: 'fit',
	        stateful: false,

            //height: 200,
	        autoScroll: true,
            padding: 3,

	        cls: 'search-filter-panel',
	        title: 'Find layers by:',

	        items: [
                this.themeFilter,
                this.methodFilter,
                this.locationFilter,
                this.organisationFilter,
                this.parameterFilter/*,
                this.boundingBoxFilter*/
	        ]
		}, config);

		Portal.ui.search.SearchFiltersPanel.superclass.constructor.call(this, config);
	},

    initComponent: function() {
        Portal.ui.search.SearchFiltersPanel.superclass.initComponent.apply(this);
    }
});

