Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchFiltersPanel = Ext.extend(Ext.Panel, {

	constructor: function(config) {

        this.titleBar = new Ext.Panel({

            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            defaults: {
                flex: 1
            },
            items: [
                new Ext.Panel({
                    html: '<img src="images/spinner.gif" style="vertical-align: middle;" alt="Loading...">\&nbsp;<i>Loading search terms\u2025</i>'
                }),
                new Ext.Panel({
                    items: [ this._buildClearAllLink() ],
                    cls: 'faceted-search-clear-all'
                })
            ],
            boxMaxHeight: '29' // This is a bit random, but any less than 29 and the div won't be visible at all
        });

        this.parameterFilter = new Portal.ui.TermSelectionPanel({
            title: OpenLayers.i18n('parameterFilter'),
            hierarchical: false,
            fieldGroup: 'longParamNames',
            fieldName: 'longParamName',
            searcher: config.searcher
        });

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

//		this.boundingBoxFilter = new Portal.search.field.BoundingBox({
//            title: '<span class="term-selection-panel-header">' + OpenLayers.i18n('boundingBox') + '</span>',
//            collapsed: true,
//            collapsible: true,
//            padding: 3,
//            cls: 'term-selection-panel'
//		});

		config = Ext.apply({
	        stateful: false,

            //height: 200,
	        autoScroll: true,
            padding: 3,

	        cls: 'search-filter-panel',

	        items: [
                this.titleBar,

                this.parameterFilter,
                this.themeFilter,
                this.methodFilter,
                this.locationFilter,
                this.organisationFilter/*,
                this.boundingBoxFilter*/
            ]
		}, config);

		Portal.ui.search.SearchFiltersPanel.superclass.constructor.call(this, config);

		this.mon(this.searcher, 'searchcomplete', this._showIntroMessage, this);
    	this.mon(this.searcher, 'summaryOnlySearchComplete', this._showIntroMessage, this);
		this.mon(this.searcher, 'searcherror', this._showError, this);
	},

    initComponent: function() {
        Portal.ui.search.SearchFiltersPanel.superclass.initComponent.apply(this);
    },

    _showIntroMessage: function() {
        this._setTitleText( 'Find layers by:', true ); // Todo - DN: Dictionarise
    },

    _showError: function() {
        this._setTitleText( 'Faceted search is currently unavailable.', false ); // Todo - DN: Dictionarise
    },

    _buildClearAllLink: function() {

        var link;

        link = new Ext.ux.Hyperlink({
            text: 'Clear all' // Todo - DN: Dictionarise
        });

        link.on( 'click', this._onClearAllClicked, this );

        return link;
    },

    _setTitleText: function( newText, showClearAllLink ) {

        var tb = this.titleBar;
        var title = tb.items.get( 0 );
        var link = tb.items.get( 1 );

        title.update( '<span class="faceted-search-title">' + newText + '</span>' );

        link.hidden = !showClearAllLink;

        tb.doLayout();
    },

    _onClearAllClicked: function() {

        this.parameterFilter._removeAnyFilters();
        this.themeFilter._removeAnyFilters();
        this.methodFilter._removeAnyFilters();
        this.locationFilter._removeAnyFilters();
        this.organisationFilter._removeAnyFilters();
    }
});

