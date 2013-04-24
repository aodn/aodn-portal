
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersTreeNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, {

    constructor: function(config) {

        this.buttonsRendered = false;
        Portal.ui.ActiveLayersTreeNodeUI.superclass.constructor.call(this, config);
    },

    render: function(bulkRender) {

        Portal.ui.ActiveLayersTreeNodeUI.superclass.render.apply(this, arguments);
        this.addButtons();
    },

    addButtons: function() {
        var cb = this.checkbox;
        var node = this;

        if (!this.buttonsRendered) {
            Ext.each([
                    {
                        tooltip: 'Remove layer',
                        cls: 'remove-layer-button',
                        clickHandler: this.removeLayer
                    },
                    {
                        tooltip: 'Zoom to layer',
                        cls: 'zoom-to-layer-button',
                        clickHandler: this.zoomToLayer
                    }
                ],
                function(item) {
                    var button = Ext.DomHelper.insertBefore(cb, "<input type='button' class='" + item.cls + "' title='" + item.tooltip + "'/>");
                    $(button).click(function() {
                        item.clickHandler.call(node);
                    })
                }
            );
        }
        this.buttonsRendered = true;
    },

    removeLayer: function() {

        Ext.MsgBus.publish('removeLayer', this.node.layer);
    },

    zoomToLayer: function() {

        this.deferToDelegate("zoomToLayer");
    },

    deferToDelegate: function(delegateFnName) {

        // TODO: how else to either a) fire Ext event (this is not an Ext component)
        // or b) call removeLayer indirectly?
        var activeLayersTreePanel = Ext.getCmp('activeLayerTreePanel');

        Ext.TaskMgr.start({
            run : function() {
                activeLayersTreePanel[delegateFnName]();
            },
            interval : 0,
            repeat : 1
        });
    }
});
