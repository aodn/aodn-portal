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

        this._buildFilter(
            Portal.search.HierarchicalTermSelectionPanel,
            'hierarchicalTermFilter',
            {
                searcher: config.searcher
            }
        );
    }
});
