// Ext.tree.TreeNode additions

Ext.namespace('Ext.tree');

Ext.tree.TreeNode.prototype.toValueHierarchy = function() {
    var values = [];
    var p = this;
    do {
        if (p.attributes.value) {
            values.push(encodeURIComponent(p.attributes.value));
        }
        p = p.parentNode;
    } while (p);

    return values.reverse().filter(function(n) {
        return n;
    }).join('/');
};

Ext.tree.TreeNode.prototype.clone = function(recursive) {
    var clone = new Ext.tree.TreeNode();
    Ext.applyIf(clone.attributes, this.attributes);
    clone.setText(this.text);

    if (recursive) {
        this.eachChild(function(childNode) {
            clone.appendChild((childNode.clone(true)));
        });
    }

    return clone;
};

Ext.tree.TreeNode.prototype.getHierarchy = function(attribute) {
    var values = [];
    var currentNode = this;
    do {
        if (currentNode.attributes[attribute]) {
            values.unshift(currentNode.attributes[attribute]);
        }
        currentNode = currentNode.parentNode;
    } while (currentNode);
    return values;
};

// Ext.Component additions

// Function to wrap a supplied callback so that it will not be called if the calling
// component has been destroyed.

Ext.Component.prototype.createSafeCallback = function(callback) {
    var callingComponent = this;

    return function() {
        if (typeof callingComponent.isDestroyed === "undefined" || !callingComponent.isDestroyed) {
            callback.apply(this, arguments);
        }
    }
};
