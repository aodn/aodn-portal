Ext.namespace('Portal.data');

Portal.data.ServerNodeLayerDescriptorStore = Ext.extend(Ext.data.JsonStore, {
	
	node: undefined,
	sorter: undefined,
	
	constructor: function(cfg) {
		// This store can't function without a TreeNode
		if (!cfg || !cfg.node) {
			throw 'ServerNodeLayerDescriptorStore requires a Ext.tree.TreeNode';
		}
		this.node = cfg.node;
		
		// Sorting is optional
		if (cfg.treePanel) {
			this.sorter = new Ext.tree.TreeSorter(cfg.treePanel, {folderSort: true});
		}

		var config = Ext.apply({
			url: 'layer/server?server=' + this.node.attributes.grailsServerId,
            storeId: 'layerDescriptorStore' + this.node.attributes.grailsServerId,
        	root: 'layerDescriptors',
        	fields: ['id', 'title', {name: 'server', mapping: 'server.id' }, 'layers' ]
		}, cfg);
		
		Portal.data.ServerNodeLayerDescriptorStore.superclass.constructor.call(this, config);
		
		this.on('load',  function(store, recs, opt) {
			this.beginNodeUpdate();
            this.updateNode(store);
            this.endNodeUpdate();
		}, this);
	},
	
	beginNodeUpdate: function() {
		this.node.beginUpdate();
    	this.node.expand();
	},
	
	endNodeUpdate: function() {
		this.sort(this.node);
        this.node.endUpdate();
	},
	
	updateNode: function(store) {
		store.each(function(record) {
			this.createChild(this.node, record.data.id, record.data.title, record.data.layers, record.data.server);
        }, this);
	},
	
	createChild: function(parent, id, title, layers, server) {
		var child = this.toNode(title, layers, server);
		parent.appendChild(child);
		if (layers && layers.length > 0) {
			this.addChildren(child, layers);
		}
		else {
			child.leaf = true;
			child.attributes.grailsLayerId = id;
		}
	},

	addChildren: function (parent, layers) {
		Ext.each(layers, function(item, index, all) {
			this.createChild(parent, item.id, item.title, item.layers, item.server.id);
		}, this);
	},
	
	toNode: function(title, layers, server) {
		return new Ext.tree.TreeNode({
    		text: title,
    		layers: layers,
    		server: server
        });
	},
	
	sort: function(node) {
		if (this.sorter) {
			this.sorter.doSort(node);
		}
	}
});
