
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchFiltersPanel = Ext.extend(Ext.Panel, {

	constructor: function(config) {

        this.titleBar = new Ext.Panel({

            layout: {
                type: 'hbox'
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
            boxMaxHeight: '1' // Not sure why this is needed
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
            layout: 'fit',

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
        this.mon(this.searcher, 'filteradded', this._setClearAllLinkVisibility, this);
        this.mon(this.searcher, 'filterremoved', this._setClearAllLinkVisibility, this);

        this.mon(this.titleBar, 'afterrender', function() { this.searcher.search( true ); return true; }, this );
	},

    initComponent: function() {
        Portal.ui.search.SearchFiltersPanel.superclass.initComponent.apply(this);
    },

    _showIntroMessage: function() {
        this._setTitleText( OpenLayers.i18n('facetedSearchPanelTitle') );
    },

    _showError: function() {
        this._setTitleText( OpenLayers.i18n('facetedSearchUnavailableText') );
    },

    _buildClearAllLink: function() {

        this.clearAllLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('facetedSearchClearAllLink'),
            hidden: true
        });

        this.clearAllLink.on( 'click', this._onClearAllClicked, this );

        return this.clearAllLink;
    },

    _setTitleText: function( newText ) {

        var tb = this.titleBar;
        var title = tb.items.get( 0 );

        title.update( '<span class="faceted-search-title">' + newText + '</span>' );
        tb.doLayout();
    },

    _onClearAllClicked: function() {

        this.parameterFilter.removeAnyFilters();
        this.themeFilter.removeAnyFilters();
        this.methodFilter.removeAnyFilters();
        this.locationFilter.removeAnyFilters();
        this.organisationFilter.removeAnyFilters();

        this.searcher.search();
    },

    _setClearAllLinkVisibility: function() {

        this.clearAllLink.setVisible( this.searcher.hasFilters() );
    }
});

