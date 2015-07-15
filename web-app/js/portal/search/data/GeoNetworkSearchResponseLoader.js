/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.ui.search.data');

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
    },

    requestData: function(node, callback, scope) {
        // DF: Set default headers to application/xml in order to avoid apache
        // embedding a text/plain and then response.responseXML being unset,
        // resulting in the XML tree class failing
        // This parameter is globally set, but doesn't seem to interfere with
        // the rest of the portal operation

        var ajaxDefaultHeaders = Ext.Ajax.defaultHeaders;
        Ext.Ajax.defaultHeaders = { 'Content-Type': 'application/xml' };

        Portal.ui.search.data.GeoNetworkSearchResponseLoader.superclass.requestData.call(this, node, callback, scope);

        // Restore ajaxDefaultHeaders for Ext4.Ajax
        Ext.Ajax.defaultHeaders = ajaxDefaultHeaders;
    }
});
