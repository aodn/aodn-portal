/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.search.data');

Portal.ui.search.data.GeoNetworkSearchResponseLoader = Ext.extend(Ext.ux.tree.XmlTreeLoader, {

    createNode: function(attr) {
        var node = Portal.ui.search.data.GeoNetworkSearchResponseLoader.superclass.createNode.call(this, attr);

        node.toNameHierarchy = function() {
            var names = [];
            var p = this;

            do {
                names.push(p.attributes.name);
                p = p.parentNode;
            } while (p.parentNode)

            return names.reverse().filter(function(n) {
                return n;
            }).join('/');
        };

        return node;
    },

    processAttributes: function(attr) {
        attr.text = String.format("{0} ({1})", attr.name, attr.count);
        attr.loaded = true;
    }
});
