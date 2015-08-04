

Ext.namespace('Portal.search');

Portal.search.FacetDrilldownPanel = Ext.extend(Ext.tree.TreePanel, {
    constructor: function(cfg) {
        cfg = cfg || {};

        Ext.apply(cfg, {
            animate: false,
            singleExpand: true,
            rootVisible: false,
            cls: "hierarchicalTree",
            lines: false,
            headerCfg: {
                cls: 'drilldown-separator'
            },
            pathSeparator: '\u001F'
        });

        Portal.search.FacetDrilldownPanel.superclass.constructor.call(this, cfg);

        this._initDrilldown();

        this.addEvents('drilldownchange');

        this.getSelectionModel().on('selectionchange', this._onSelectionChange, this);
        this.on('checkchange', this._onCheckChange, this);

        this.mon(this.searcher, 'searchcomplete', function() {
            this._onSearchComplete();
        }, this);
    },

    getDrilldownPath: function() {
        return this._selectedNodeValueHierarchy;
    },

    hasDrilldown: function() {
        return this._selectedNodeValueHierarchy
            && this._selectedNodeValueHierarchy != this.root.toValueHierarchy();
    },

    hasNoDrilldown: function() {
        return !this.hasDrilldown();
    },

    setSelectedDrilldown: function(categories) {
        var nodeToSelect = this._getNode(categories);
        this._setSelectedNode(nodeToSelect);
    },

    _setSelectedNode: function(node) {
        this._selectedNodeValueHierarchy = node.toValueHierarchy();
        this._buildTree();
        this.fireEvent('drilldownchange', this);
    },

    _getNode: function(categories) {
        var path = this.pathSeparator + categories.join(this.pathSeparator);

        return this.root.findChildBy(function(node) {
            return node.getPath('value') == path;
        }, this, true);
    },

    clearDrilldown: function() {
        if (this.hasDrilldown()) {
            this._initDrilldown();
            this.fireEvent('drilldownchange', this);
        }
    },

    _initDrilldown: function() {
        this._selectedNodeValueHierarchy = "";
        this._buildTree();
    },

    _onCheckChange: function(node) {
        this._selectedNodeValueHierarchy = node.parentNode.toValueHierarchy();
        this.fireEvent('drilldownchange', this);
    },

    _onSelectionChange: function(selectionModel, node) {
        this._selectedNodeValueHierarchy = node.toValueHierarchy();
        trackFacetUsage(this.facetName, node.attributes.value);
        this.fireEvent('drilldownchange', this);
    },

    _onSearchComplete: function() {
        this._buildTree();
    },

    _buildTree: function() {
        if (this.searcher.hasFacetNode(this.facetName)) {
            this.setRootNode(this.searcher.getFacetNode(this.facetName));
        } else {
            this.setRootNode(new Ext.tree.TreeNode());
        }
    },

    setRootNode: function(rootNode) {
        var checkedNodes = this._checkSelectedNodes(rootNode);

        Portal.search.FacetDrilldownPanel.superclass.setRootNode.call(this, rootNode);

        this._hideSiblings(checkedNodes);
        this._expand(checkedNodes);
        this._removeCount(checkedNodes);
        this._hidePreviousDrilldowns();
    },

    _checkSelectedNodes: function(facetNode) {
        var checkedNodes = [];

        facetNode.cascade(function(node) {
            if (this._isSelected(node)) {
                node.attributes.checked = true;
                checkedNodes.push(node);
            }
        }, this);

        return checkedNodes;
    },

    _isSelected: function(node) {
        return this._selectedNodeValueHierarchy.startsWith(node.toValueHierarchy());
    },

    _hidePreviousSiblings: function(node) {
        if (node.previousSibling) {
            node.previousSibling.ui.hide();
            this._hidePreviousSiblings(node.previousSibling);
        }
    },

    _hideNextSiblings: function(node) {
        if (node.nextSibling) {
            node.nextSibling.ui.hide();
            this._hideNextSiblings(node.nextSibling);
        }
    },

    _hideSiblings: function(nodes) {
        var that = this;

        Ext.each(nodes, function(node) {
            if (node.attributes.checked) {
                that._hidePreviousSiblings(node);
                that._hideNextSiblings(node);
            }

        });
    },

    _expand: function(nodes) {
        Ext.each(nodes, function(node) {
            node.expand();
        });
    },

    _removeCount: function(nodes) {
        Ext.each(nodes, function(node) {
            if (node.hasChildNodes()){
                node.setText(node.attributes.value);
            }
        });
    },

    _hidePreviousDrilldowns: function() {
        this.root.cascade(function(node) {
            if (!node.attributes.checked && this._hasPreviouslyBeenSelected(node)) {
                node.ui.hide();
            }
        }, this);
    },

    _hasPreviouslyBeenSelected: function(node) {
        var drilldown = node.getHierarchy('value');
        return this.searcher.hasDrilldown(drilldown);
    }
});
