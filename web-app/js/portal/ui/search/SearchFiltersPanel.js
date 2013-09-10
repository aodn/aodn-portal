/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchFiltersPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        this.spinner = new Ext.Panel({
            html: OpenLayers.i18n('loadingSpinner',{'resource':'search terms'}),
            hidden: true,
            flex:3
        });

        this.titleBar = new Ext.Panel({

            cls: 'x-panel-header',
            layout: {
                type: 'hbox'
            },
            items: [
                this.spinner,
                new Ext.Panel({
                    items: [ this._buildClearAllLink() ],
                    cls: 'faceted-search-clear-all',
                    flex: 1,
                    height: 25
                })
            ],
            boxMaxHeight: '1' // Not sure why this is needed
        });

        this._buildTermFilter('parameterFilter', {
            title: OpenLayers.i18n('parameterFilter'),
            hierarchical: false,
            fieldGroup: 'longParamNames',
            fieldName: 'longParamName',
            searcher: config.searcher
        });


        this._buildTermFilter('themeFilter', {
            title: OpenLayers.i18n('themeFilter'),
            hierarchical: true,
            fieldName: 'Gcmd538',
            searcher: config.searcher
        });

        this._buildTermFilter('methodFilter', {
            title: OpenLayers.i18n('methodFilter'),
            hierarchical: true,
            fieldName: 'Mcp14Cmv',
            searcher: config.searcher
        });

        this._buildTermFilter('locationFilter', {
            title: OpenLayers.i18n('locationFilter'),
            hierarchical: true,
            fieldName: 'Mcp14Gev',
            searcher: config.searcher
        });

        this._buildTermFilter('organisationFilter', {
            title: OpenLayers.i18n('organisationFilter'),
            hierarchical: false,
            fieldGroup: 'organisationNames',
            fieldName: 'orgName',
            searcher: config.searcher
        });

        this._buildFilter(Portal.search.DateSelectionPanel, 'dateFilter', {
            title: OpenLayers.i18n('dateFilter'),
            hierarchical: false,
            searcher: config.searcher
        });

        this._buildFilter(Portal.search.GeoSelectionPanel, 'geoFilter', {
            title: OpenLayers.i18n('geoFilter'),
            hierarchical: false,
            searcher: config.searcher,
            mapPanel: config.mapPanel
        });

        config = Ext.apply({
            stateful: false,
            autoScroll: true,
            padding: 3,
            layout: 'fit',
            items: [this.titleBar].concat(this.filters)
        }, config);

        Portal.ui.search.SearchFiltersPanel.superclass.constructor.call(this, config);

        var searcherEvents = [
            { event: 'searchcomplete', callback: this._hideSpinnerText },
            { event: 'summaryOnlySearchComplete', callback: this._hideSpinnerText },
            { event: 'searcherror', callback: this._showError },
            { event: 'filteradded', callback: this._setupFacetedSearchUpdating },
            { event: 'filterremoved', callback: this._setClearAllLinkVisibility },
            { event: 'polygonadded', callback: this._showClearAllForGeoFacet }
        ];
        this._monitor(this.searcher, searcherEvents, this);

        this.mon(this.titleBar, 'afterrender', function() { this.searcher.search( true ); return true; }, this );
    },

    initComponent: function() {
        Portal.ui.search.SearchFiltersPanel.superclass.initComponent.apply(this);
    },

    _showError: function() {
        this._setSpinnerText( OpenLayers.i18n('facetedSearchUnavailable') );
    },

    _buildClearAllLink: function() {

        this.clearAllLink = new Ext.ux.Hyperlink({
            text: OpenLayers.i18n('facetedSearchClearAllLink'),
            hidden: true
        });

        this.clearAllLink.on( 'click', this._onClearAllClicked, this );

        return this.clearAllLink;
    },

    _setSpinnerText: function( newText ) {
        this.spinner.update( '<span class="x-panel-header-text">' + newText + '</span>' );
        this.spinner.show();
        this.titleBar.doLayout();
    },

    _hideSpinnerText: function( ) {
        this.spinner.hide();
    },

    _onClearAllClicked: function() {

        this._setSpinnerText(OpenLayers.i18n('facetedSearchResetting'));
        Ext.each(this.filters, function(filter, index, all) {
            filter.removeAnyFilters();
        });

        this.searcher.search(true);

        this.fireEvent('filtersCleared');
    },

    _setupFacetedSearchUpdating: function() {
        this.fireEvent('facetedSearchUpdating');
        this._setClearAllLinkVisibility();
    },

    _setClearAllLinkVisibility: function() {
        this._setSpinnerText(OpenLayers.i18n('loadingSpinner',{'resource':'Collections'}));
        this.clearAllLink.setVisible( this.searcher.hasFilters() );
    },

    _showClearAllForGeoFacet: function() {
        this._setSpinnerText('');
        this.clearAllLink.setVisible(true);
        this._hideSpinnerText();
    },

    _buildTermFilter: function(name, config) {
        return this._buildFilter(Portal.ui.TermSelectionPanel, name, config);
    },

    _buildFilter: function(constructor, name, config) {
        if (this.filters === undefined) {
            this.filters = [];
        }

        if (this.filterFactory === undefined) {
            this.filterFactory = new Portal.ui.search.SearchFilterPanelFactory();
        }

        var termFilter = this.filterFactory.getInstance(constructor, Ext.apply({}, config));
        this.filters.push(termFilter);
        this[name] = termFilter;
        return termFilter;
    },

    _monitor: function(object, events, scope) {
        Ext.each(events, function(event, index, all) {
            this.mon(object, event.event, event.callback, scope);
        }, this);
    }

});
