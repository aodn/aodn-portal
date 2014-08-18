/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search');

Portal.ui.search.SearchFiltersPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        this._initTermFilters(config);

        this._buildFilter(Portal.search.DateSelectionPanel, 'dateFilter', {
            title: OpenLayers.i18n('dateFilter'),
            hierarchical: false,
            searcher: config.searcher,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });

        this._buildFilter(Portal.search.GeoSelectionPanel, 'geoFilter', {
            title: OpenLayers.i18n('geoFilter'),
            hierarchical: false,
            searcher: config.searcher,
            mapPanel: config.mapPanel,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });

        config = Ext.apply({
            stateful: false,
            autoScroll: true,
            padding: 3,
            layout: 'auto',
            title: OpenLayers.i18n('stepHeader', { stepNumber: 1, stepDescription: OpenLayers.i18n('step1Description')}),
            headerCfg: {
                cls: 'steps'
            },
            tbar: this._buildToolBar(),
            items: this.filters
        }, config);

        Portal.ui.search.SearchFiltersPanel.superclass.constructor.call(this, config);

        var searcherEvents = [
            { event: 'searchcomplete', callback: this._hideSpinnerText },
            { event: 'hiersearchcomplete', callback: this._hideSpinnerText },
            { event: 'searcherror', callback: this._showError },
            { event: 'filteradded', callback: this._setupFacetedSearchUpdating },
            { event: 'filterremoved', callback: this._setNewSearchButtonVisibility },
            { event: 'polygonadded', callback: this._showNewSearchForGeoFacet }
        ];
        this._monitor(this.searcher, searcherEvents, this);
    },

    initComponent: function() {
        Portal.ui.search.SearchFiltersPanel.superclass.initComponent.apply(this);
    },

    _initTermFilters: function(config) {
        this._buildTermFilter('parameterFilter', {
            title: OpenLayers.i18n('parameterFilter'),
            hierarchical: false,
            fieldGroup: 'longParamNames',
            fieldName: 'longParamName',
            searcher: config.searcher,
            collapsed: false,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });

        this._buildTermFilter('organisationFilter', {
            title: OpenLayers.i18n('organisationFilter'),
            hierarchical: false,
            fieldGroup: 'organisationNames',
            fieldName: 'orgName',
            searcher: config.searcher,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });

        this._buildTermFilter('platformFilter', {
            title: OpenLayers.i18n('platformFilter'),
            hierarchical: false,
            fieldGroup: 'platformNames',
            fieldName: 'platform',
            searcher: config.searcher,
            collapsed: false,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });
    },

    _showError: function() {
        this._setSpinnerText( OpenLayers.i18n('facetedSearchUnavailable') );
    },

    _buildToolBar: function() {
        return new Ext.Toolbar({
            cls: 'search-filters-toolbar',
            border: false,
            height: 28,
            frame: false,
            items: [this._buildSpinner(), '->', this._buildNewSearchButton()]
        });
    },

    _buildSpinner: function() {
        this.spinner = new Ext.Panel({
            html: OpenLayers.i18n('loadingSpinner', {'resource':'search terms'}),
            hidden: false
        });

        return this.spinner;
    },

    _buildNewSearchButton: function() {
        this.newSearchButton = new Ext.Button({
            text: OpenLayers.i18n('facetedSearchNewSearchButton'),
            hidden: true
        });

        this.newSearchButton.on( 'click', this._onNewSearchClicked, this );

        return this.newSearchButton;
    },

    _setSpinnerText: function( newText ) {
        this.spinner.update( newText);
        this.spinner.show();
    },

    _hideSpinnerText: function( ) {
        this.spinner.hide();
    },

    _onNewSearchClicked: function() {
        this._setSpinnerText(OpenLayers.i18n('facetedSearchResetting'));

        Ext.each(this.filters, function(filter, index, all) {
            filter.removeAnyFilters();
        });

        this.searcher.search();
        this.fireEvent('filtersCleared');
    },

    _setupFacetedSearchUpdating: function() {
        this.fireEvent('facetedSearchUpdating');
        this._setNewSearchButtonVisibility();
    },

    _setNewSearchButtonVisibility: function() {
        this._setSpinnerText(OpenLayers.i18n('loadingSpinner',{'resource':'Collections'}));
        this.newSearchButton.setVisible( this.searcher.hasFilters() );
    },

    _showNewSearchForGeoFacet: function() {
        this._setSpinnerText('');
        this.newSearchButton.setVisible(true);
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
            this.filterFactory = new Portal.ObjectFactory();
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
    },

    _getJQueryElement: function(domElement) {
        return $(domElement);
    },

    _onExpand: function(evt) {
        var el = this._getJQueryElement(evt.el.dom.parentElement);
        el.scrollTo(evt.el.dom);
    }
});
