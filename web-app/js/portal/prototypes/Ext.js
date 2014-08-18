/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Ext.tree');

Ext.tree.TreeNode.prototype.getUniqueId = function() {
    return JSON.stringify({
        tagName: this.attributes.tagName,
        value: this.attributes.value
    });
};

Ext.tree.TreeNode.prototype.eachNodeRecursive = function(fn) {

    fn(this);

    this.eachChild(function(childNode) {
        childNode.eachNodeRecursive(fn);
    });
};

Ext.tree.TreeNode.prototype.equals = function(other) {
    return this.getUniqueId() === other.getUniqueId();
};
