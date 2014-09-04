/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search.data');

Portal.ui.search.data.GeoNetworkSearchResponseLoader = Ext.extend(Ext.ux.tree.XmlTreeLoader, {

    createNode: function(attr) {
        return Portal.ui.search.data.GeoNetworkSearchResponseLoader.superclass.createNode.call(this, attr);
    },

    processAttributes: function(attr) {
        attr.text = String.format("{0} ({1})", attr.value, attr.count);
        attr.loaded = true;
    },

    getParams: function(node) {
        return {};
    }
});
