/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.FilterCqlBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    _joinCql: function(parts) {

        return this._join(parts, ' AND ');
    }
});
