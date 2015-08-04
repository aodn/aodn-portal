

Ext.namespace('Portal.test');

Portal.test.TestContainer = Ext.extend(Ext.Container, {

    constructor: function(cfg) {
        cfg = cfg || {};

        Ext.apply(cfg, {
            renderTo: this._createContainerDiv()
        });

        Portal.test.TestContainer.superclass.constructor.call(this, cfg);
    },

    destroy: function() {
        Ext.removeNode(this._getContainerNode());
        Portal.test.TestContainer.superclass.destroy.call(this);
    },

    _createContainerDiv: function() {
        return Ext.DomHelper.append(
            Ext.getBody(), 
            "<div id='" + this._getContainerId() + "' style='visibility: hidden'></div>"
        );
    },

    _getContainerId: function() {
        return this.getId() + "-test-container";
    },

    _getContainerNode: function() {
        return Ext.get(this._getContainerId()).dom;
    }
});
