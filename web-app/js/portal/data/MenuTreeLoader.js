
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.data');

Portal.data.MenuTreeLoader = Ext.extend(Ext.tree.TreeLoader, {

    constructor: function(cfg) {
        var config = Ext.apply({
            url: 'menu/json/' + cfg.menuId,
            preloadChildren: true,
            clearOnLoad: false
        }, cfg);
        Portal.data.MenuTreeLoader.superclass.constructor.call(this, config);

        this.on('beforeload',  function(loader, node, callback) {
            if (node.attributes.grailsServerId) {
                // This will now delegate handling to ServerNodeLayerDescriptorStore
                return false;
            }
            else if((node.getDepth() > 0) && !node.attributes.grailsServerId && !node.attributes.grailsLayerId){
                return false;
            }
            return true;
        }, this);
    },

    processResponse: function(response, node, callback) {
        var root = Ext.util.JSON.decode(response.responseText);

        var items = [];
        if (this.isNotEmpty(root.menuItems)) {
            items = root.menuItems;
        }
        else if (this.isNotEmpty(root.childItems)) {
            items = root.childItems;
        }

        try {
            node.beginUpdate();
            this.parseItems(node, items);
            //node.appendChild();
            node.endUpdate();
            //TODO: check childNodes
            this.runCallback(callback, this || node, [node]);
        }
        catch(e) {
            this.handleFailure(response);
        }
    },

    parseItems: function (parent, items) {
        Ext.each(items, function(item, index, all) {
            var child = this.createNode(item);
            if (this.isNotEmpty(item.childItems)) {
                this.parseItems(child, item.childItems);
            }
            parent.appendChild(child);
        }, this);
    },

    createNode: function(attr) {
        attr.grailsLayerId = this.getLayerId(attr);
        attr.grailsServerId = this.getServerId(attr);

        if (this.isLayerBlackListed(attr.layer)) {
            attr.cls = 'layer_blacklisted';
        }
        else if (!this.isLayerActive(attr.layer)) {
            attr.cls = 'layer_inactive';
        }
        return Ext.tree.TreeLoader.prototype.createNode.call(this, attr);
    },

    isLayerBlackListed: function(layer) {
        return layer && layer.blacklisted;
    },

    isLayerActive: function(layer) {
        return !layer || layer.activeInLastScan; 
    },

    isNotEmpty: function(collection) {
        return collection && collection.length > 0
    },

    getLayer: function(attr) {
        return attr.layer;
    },

    getLayerId: function(attr) {
        if (this.getLayer(attr)) {
            return this.getLayer(attr).id;
        }
        return undefined;
    },

    getServer: function(attr) {
        return attr.server;
    },

    getServerId: function(attr) {
        if (this.getServer(attr)) {
            return this.getServer(attr).id;
        }
        return undefined;
    }
});
