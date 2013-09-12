/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.FacetedSearchTemplate = Ext.extend(Ext.Template, {

    constructor: function() {


        Portal.search.FacetedSearchResultsColumnModel.superclass.constructor.call(this, config);
    }
});
