/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search.data');

Portal.ui.search.data.GeoNetworkSearchResponseLoader = Ext.extend(Ext.ux.tree.XmlTreeLoader, {
    processAttributes : function(attr) {
        attr.text = String.format("{0} ({1})", attr.name, attr.count);
        attr.loaded = true;
    }
});
