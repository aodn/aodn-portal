Ext.namespace('Portal.search');

Portal.search.SearchFiltersPanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        this._initFacetFilters(config);

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

        Ext.MsgBus.subscribe(PORTAL_EVENTS.RESET, function() {
            this._clearAllSearchFilters();
        }, this);

        Portal.search.SearchFiltersPanel.superclass.constructor.call(this, config);

        var searcherEvents = [
            { event: 'searchcomplete', callback: this._hideSpinnerText },
            { event: 'searcherror', callback: this._showError },
            { event: 'filteradded', callback: this._setupFacetedSearchUpdating },
            { event: 'filterremoved', callback: this._setNewSearchButtonVisibility },
            { event: 'polygonadded', callback: this._showNewSearchForGeoFacet }
        ];
        this._monitor(this.searcher, searcherEvents, this);
    },

    _getEnabledFacets: function() {
        return Portal.app.appConfig.enabledFacets;
    },

    _initFacetFilters: function(config) {
        var enabledFacets = this._getEnabledFacets();

        for (var i = 0; i < enabledFacets.length; i++) {
            var facet = enabledFacets[i];

            var facetClass = facet.classId ? eval(facet.classId) : Portal.search.FacetFilterPanel;
            var collapsedByDefault = facet.collapsedByDefault ? true : false;

            this._buildFilter(
                facetClass,
                facet.name,
                {
                    facetName: facet.key,
                    title: OpenLayers.i18n(facet.name),
                    collapsedByDefault: collapsedByDefault,
                    searcher: config.searcher,
                    mapPanel: config.mapPanel,
                    listeners: {
                        expand: this._onExpand,
                        scope: this
                    }
                }
            );
        }
    },

    _showError: function() {
        this._setSpinnerText(OpenLayers.i18n('facetedSearchUnavailable'));
    },

    _buildToolBar: function() {
        return new Ext.Toolbar({
            cls: 'search-filters-toolbar',
            border: false,
            frame: false,
            items: [this._buildSpinner(), '->', this._buildNewSearchButton()]
        });
    },

    _buildSpinner: function() {
        this.spinner = new Ext.Panel({
            html: this._makeSpinnerText(OpenLayers.i18n('loadingMessage', {'resource': 'search terms'})),
            cls: 'search-filters-toolbar-title',
            hidden: false
        });

        return this.spinner;
    },

    _buildNewSearchButton: function() {

        this.newSearchButton = new Ext.ux.Hyperlink({
            cls: 'resetText small',
            text: OpenLayers.i18n('clearLinkLabel', {text: OpenLayers.i18n('facetedSearchNewSearchButton')}),
            hidden: true
        });
        this.newSearchButton.on('click', function() {
            this._clearAllSearchFilters();
        }, this);

        return this.newSearchButton;
    },

    _setSpinnerText: function(newText) {
        this.spinner.update(this._makeSpinnerText(newText));
        this.spinner.show();
    },

    _makeSpinnerText: function(text) {
        return '<span class=\"fa fa-fw fa-spin fa-spinner \"></span> ' + text;
    },

    _hideSpinnerText: function() {
        this.spinner.hide();
    },

    _clearAllSearchFilters: function() {
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
        this._setSpinnerText(OpenLayers.i18n('loadingMessage', {'resource': 'Collections'}));
        this.newSearchButton.setVisible(this.searcher.hasFilters());
    },

    _showNewSearchForGeoFacet: function() {
        this._setSpinnerText('');
        this.newSearchButton.setVisible(true);
        this._hideSpinnerText();
    },

    _buildFilter: function(constructor, name, config) {
        if (this.filters === undefined) {
            this.filters = [];
        }

        if (this.filterFactory === undefined) {
            this.filterFactory = new Portal.ObjectFactory();
        }

        var facetFilter = this.filterFactory.getInstance(constructor, Ext.apply({}, config));

        this.filters.push(facetFilter);
        this[name] = facetFilter;
        return facetFilter;
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
