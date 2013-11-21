/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.filter');

Portal.filter.DateRangeFilterPanel = Ext.extend(Portal.filter.DateFilterPanel, {
    getVisualisationCQL: function() {
        return this._getCQLUsingColumnNames(this.filter.wmsStartDateName, this.filter.wmsEndDateName);
    }
});
