/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

// Note: this class and its parent can be combined when hierarchical becomes the
// only search filtering method.
Portal.search.HierarchicalSearchFiltersPanel = Ext.extend(Portal.ui.search.SearchFiltersPanel, {

    _initTermFilters: function(config) {

        // TODO: add these dynamically.
        this._buildFilter(
            Portal.search.HierarchicalTermSelectionPanel,
            'parameterFilter',
            {
                dimensionValue: "Measured parameter",
                title: OpenLayers.i18n('parameterFilter'),
                searcher: config.searcher,
                collapsed: false,
                listeners: {
                    expand: this._onExpand,
                    scope: this
                }
            }
        );

        this._buildFilter(
            Portal.search.HierarchicalTermSelectionPanel,
            'organisationFilter',
            {
                dimensionValue: "Organisation",
                title: OpenLayers.i18n('organisationFilter'),
                searcher: config.searcher,
                collapsed: false,
                listeners: {
                    expand: this._onExpand,
                    scope: this
                }
            }
        );

        this._buildFilter(
            Portal.search.HierarchicalTermSelectionPanel,
            'platformFilter',
            {
                dimensionValue: "Platform",
                title: OpenLayers.i18n('platformFilter'),
                searcher: config.searcher,
                collapsed: false,
                listeners: {
                    expand: this._onExpand,
                    scope: this
                }
            }
        );
    }
});
