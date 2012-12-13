Portal.ui.MenuPanel = Ext.extend(Ext.tree.TreePanel, {

    constructor:function (cfg) {

        var config = Ext.apply({
            title:'Map Layers',
            loader:new Portal.data.MenuTreeLoader({
                menuId:cfg.menuId
            }),
            root:new Ext.tree.AsyncTreeNode({
                draggable:false
            }),
            collapsible:false,
            rootVisible:false,
            listeners:{
                // add layers to map or expand discoveries
                click:function (node) {
                    if (node.attributes.grailsLayerId) {
                        this.toggleNode(false, node);
                    }
                    else {
                        //this should be a folder
                        node.expand();
                    }
                },
                expandnode:function (node) {
                    if (node.attributes.grailsServerId) {
                        node.getUI().beforeLoad();
                        Portal.data.ServerNodeLayerDescriptorStore.HandleServerLayerDescriptorStoreLoad(
                            node,
                            this,
                            function () {
                                this.fireEvent('serverloaded', node);
                                node.getUI().afterLoad();
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

    defaultEnable:function (enable) {
        if (enable === undefined) {
            return false;
        }
        return enable;
    },

    defaultNode:function (node) {
        if (node === undefined) {
            return this.getRootNode();
        }
        return node;
    },

    toggleNodeBranch:function (enable, node) {
        var _node = this.defaultNode(node);
        this.toggleNode(enable, _node);
        Ext.each(_node.childNodes, function (child, index, all) {
            this.toggleNodeBranch(enable, child);
        }, this);
    },

    toggleLayerNodes:function (id, enable, node) {
        var _enable = this.defaultEnable(enable);
        var _node = this.defaultNode(node);

        if (!Ext.isEmpty(id) && _node.attributes.grailsLayerId == id) {
            this.toggleNode(_enable, _node);
        }
        _node.eachChild(function (child) {
            this.toggleLayerNodes(id, _enable, child);
        }, this);
    },

    resetTree:function (collapse) {
        this.defaultNode().cascade(function () {
            this.enable();
        });
        if (collapse) {
            this.defaultNode().collapseChildNodes(true);
        }
    },

    toggleNode:function (enable, node) {
        if (enable) {
            node.enable();
        }
        else {
            node.disable();
        }
    }
});
