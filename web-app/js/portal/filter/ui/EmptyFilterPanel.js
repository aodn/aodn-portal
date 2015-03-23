/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.EmptyFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {

        Portal.filter.ui.EmptyFilterPanel.superclass.constructor.call(this, cfg);
    },

    _createField: function() {},

    getFilterData: function() {

        return {
            visualised: false
        };
    },

    handleRemoveFilter: function() {},

    needsFilterRange: function() {

        return false;
    }
});
