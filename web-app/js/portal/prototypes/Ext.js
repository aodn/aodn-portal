/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Ext.tree');

Ext.tree.TreeNode.prototype.toValueHierarchy = function() {
    var values = [];
    var p = this;
    do {
        if (p.attributes.value) {
            values.push(encodeURIComponent(p.attributes.value));
        }
        p = p.parentNode;
    } while (p && p.parentNode)

    return values.reverse().filter(function(n) {
        return n;
    }).join('/');
};

Ext.tree.TreeNode.prototype.eachNodeRecursive = function(fn) {

    fn(this);

    this.eachChild(function(childNode) {
        childNode.eachNodeRecursive(fn);
    });
};

