Ext.namespace('Portal.ui');

Portal.ui.MapMenuPanel = Ext.extend(Ext.TabPanel, {

    constructor: function(cfg) {
		
        this.defaultMenuTree = new Portal.ui.MenuPanel({
            menuId: cfg.menuId
        });
		this.userDefinedWMSPanel = new Portal.ui.UserDefinedWMSPanel({
            //menuId: appConfig.menuId
        });		
		
        var config = Ext.apply({
            defaults: {
                padding: 5,
                autoScroll: true                
            },
            stateful: false,        
            flex: 1,
            border: false,
            enableTabScroll: true,
            activeTab: 0,
            items: [
                this.defaultMenuTree,				
				this.userDefinedWMSPanel
            ]
        }, cfg);
		
        Portal.ui.MapMenuPanel.superclass.constructor.call(this, config);
		
        this.relayEvents(this.defaultMenuTree, ['click', 'serverloaded']);
    },
	
    toggleNodeBranch: function(enable, node) {
        this.defaultMenuTree.toggleNodeBranch(enable, node);
    },
	
    toggleLayerNodes: function(id, enable, node) {
        this.defaultMenuTree.toggleLayerNodes(id, enable, node);
    },
	
    initBaseLayerCombo: function() {
        this.defaultMenuTree.initBaseLayerCombo();
    }
});

Ext.reg('portal.ui.mapmenupanel', Portal.ui.MapMenuPanel);

Portal.ui.MenuPanel = Ext.extend(Ext.tree.TreePanel, {
	
    constructor: function(cfg) {
		
        var config = Ext.apply({
            title: 'Map Layers',
            loader: new Portal.data.MenuTreeLoader({
                menuId: cfg.menuId
            }),
            root: new Ext.tree.AsyncTreeNode({
                draggable: false
            }),
            collapsible: false,
            rootVisible: false,
            listeners: {
                // add layers to map or expand discoveries
                click: function(node) {
                    if (node.attributes.grailsLayerId) {
                        this.toggleNode(false, node);
                    }
                    else {                        
                        //this should be a folder
                        node.expand();
                    }
                },
                expandnode: function(node) {
                    if (node.attributes.grailsServerId) {
                        Portal.data.ServerNodeLayerDescriptorStore.HandleServerLayerDescriptorStoreLoad(
                            node, 
                            this, 
                            function() {
                                this.fireEvent('serverloaded', node);
                            }, 
                            this
                            );
                    }
                }
            }
        }, cfg);
		
        Portal.ui.MenuPanel.superclass.constructor.call(this, config);
        this.addEvents('serverloaded');
    },
	
    defaultEnable: function(enable) {
        if (enable === undefined) {
            return false;
        }
        return enable;
    },
	
    defaultNode: function(node) {
        if (node === undefined) {
            return this.getRootNode();
        }
        return node;
    },
	
    toggleNodeBranch: function(enable, node) {
        var _node = this.defaultNode(node);
        this.toggleNode(enable, _node);
        Ext.each(_node.childNodes, function(child, index, all) {
            this.toggleNodeBranch(enable, child);
        }, this);
    },
	
    toggleLayerNodes: function(id, enable, node) {
        var _enable = this.defaultEnable(enable);
        var _node = this.defaultNode(node);
		
        if (!Ext.isEmpty(id) && _node.attributes.grailsLayerId == id) {
            this.toggleNode(_enable, _node);
        }
        _node.eachChild(function(child) {
            this.toggleLayerNodes(id, _enable, child);
        }, this);
    },
	
    toggleNode: function(enable, node) {
        if (enable) {
            node.enable();
        }
        else {
            node.disable();
        }
    }
});