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

        this._buildFilter(Portal.search.HierarchicalTermSelectionPanel, 'parameterFilter', {
            dimensionName: "Parameter",
            title: OpenLayers.i18n('parameterFilter'),
            hierarchical: false,
            //fieldGroup: 'longParamNames',
            //fieldName: 'longParamName',
            searcher: config.searcher,
            collapsed: false,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });

        this._buildFilter(Portal.search.HierarchicalTermSelectionPanel, 'organisationFilter', {
            dimensionName: "Platform",
            title: OpenLayers.i18n('organisationFilter'),
            hierarchical: false,
            //fieldGroup: 'organisationNames',
            //fieldName: 'orgName',
            searcher: config.searcher,
            listeners: {
                expand: this._onExpand,
                scope: this
            }
        });

    }
});
