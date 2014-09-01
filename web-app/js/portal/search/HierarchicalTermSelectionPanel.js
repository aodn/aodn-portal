/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search');

Portal.search.HierarchicalTermSelectionPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        cfg = cfg || {};
        this.LABEL_LENGTH = 50;
        this.dimensionValue = cfg.dimensionValue;
        this.collapsedByDefault = cfg.collapsedByDefault;

        this.searcher = cfg.searcher;

        cfg.title = '<span class="term-selection-panel-header">' + cfg.title + '</span>';

        cfg = Ext.apply({
            // TODO: initialise with actual node if it exists.
            animate: false,
            root: new Ext.tree.TreeNode(),
            containerScroll: true,
            autoScroll: true,
            collapsible: true,
            collapsed: cfg.collapsedByDefault,
            singleExpand: true,
            rootVisible: false,
            cls: "search-filter-panel hierarchicalTree term-selection-panel",
            lines: false
        }, cfg);

        this.tree = new Ext.tree.TreePanel(cfg);

        this.selectedNodeCheckbox = new Ext.form.Checkbox({
            checked: true,
            flex: 1,
            margins: {top: 0, right: 5, bottom: 5, left: 5},
            listeners: {
                scope: this,
                'check': function(checkbox, checked) {
                    if (!checked) {
                        this.removeFilters();
                    }
                }
            }
        });

        this.selectedNodeLabel = new Ext.form.Label({
            flex: 15,
            value: ""
        });

        this.treeResetContainer = new Ext.Container({
            layout: "hbox",
            cls: 'treeResetContainer',
            padding: 5,
            hidden: true,
            items: [
                this.selectedNodeCheckbox,
                this.selectedNodeLabel
            ]
        });

        Portal.search.HierarchicalTermSelectionPanel.superclass.constructor.call(this, {
            items: [
                this.tree,
                this.treeResetContainer
            ]
        });

        this.tree.getSelectionModel().on('selectionchange', this._onSelectionChange, this);
        this.mon(this.searcher, 'hiersearchcomplete', function() {
            this._onSearchComplete();
        }, this);
    },

    _setTreeResetContainer: function(node, label) {

        this.selectedNodeCheckbox.inputValue = node.toValueHierarchy();
        this.selectedNodeCheckbox.setValue(true);
        this.selectedNodeLabel.setText(label);
        this.treeShowHide(true);
    },

    removeFilters: function() {

        this.searcher.removeDimensionfilters(this.dimensionValue);
        this.searcher.search();
    },

    removeAnyFilters: function() {
        this.resetPanelDefaults();
        this.searcher.removeDrilldownFilters();
    },

    _onSelectionChange: function(selectionModel, node) {

        if (node.isSelected()) {
            this.searcher.addDrilldownFilter(node.toValueHierarchy());
            this.searcher.search();
        }

        var label = node.attributes.value;
        if (label.length > this.LABEL_LENGTH) {
            label = label.substr(0, this.LABEL_LENGTH) + '...';
        }
        if (node.hasChildNodes()) {
            node.expand();
        }
        this._setTreeResetContainer(node, label);
    },

    resetPanelDefaults: function() {
        if (this.collapsedByDefault) {
            this.tree.collapse();
        }
        else {
            this.tree.expand();
        }
        this.treeResetContainer.hide();
    },

    treeShowHide: function(hideTree) {

        if (hideTree) {
            this.tree.collapse();
            // todo: enable disable the collapse icon
            this.treeResetContainer.show();
        }
        else {
            this.tree.expand();
            this.treeResetContainer.hide();
        }
        this.doLayout();
    },

    _onSearchComplete: function() {

        var node = this.searcher.getDimensionNodeByValue(this.dimensionValue);

        this.tree.setRootNode(node);
        if (!this.selectedNodeCheckbox.getValue()) {
            this.treeShowHide();
        }
    }

});
