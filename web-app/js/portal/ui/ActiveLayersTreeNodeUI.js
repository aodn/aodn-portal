
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.ActiveLayersTreeNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, {
    buttons: null,

    constructor: function(config) {

        this.buttonsRendered = false;
        Portal.ui.ActiveLayersTreeNodeUI.superclass.constructor.call(this, config);
        this.buttons = [];
    },

    render: function(bulkRender) {

        Portal.ui.ActiveLayersTreeNodeUI.superclass.render.apply(this, arguments);
        this.addButtons();
    },

    addButtons: function() {
        var cb = this.checkbox;
        var node = this;

        that = this;
        if (!this.buttonsRendered) {
            Ext.each([
                    {
                        // This is the spinner button, indicating loading of
                        // map. Styling and cls will be applied by calling
                        // layerLoadingStart
                    },
                    {
                        tooltip: 'Remove collection',
                        cls: 'remove-layer-button',
                        clickHandler: this.removeLayer
                    },
                    {
                        tooltip: 'Zoom to collection',
                        cls: 'zoom-to-layer-button',
                        clickHandler: this.zoomToLayer
                    }
                ],
                function(item) {
                    var button = Ext.DomHelper.insertBefore(cb,
                        "<input type='button' class='" + item.cls + "' title='" + item.tooltip + "'/>");
                    that.buttons.push(button);
                    if (item.clickHandler) {
                        $(button).click(function() {
                            item.clickHandler.call(node);
                        });
                    }
                }
            );
            that.layerLoadingStart();
        }
        this.buttonsRendered = true;
    },

    removeLayer: function() {
        Portal.data.ActiveGeoNetworkRecordStore.instance().remove(this.node.layer.parentGeoNetworkRecord);
    },

    zoomToLayer: function() {

        this.deferToDelegate("zoomToLayer");
    },

    layerLoadingStart: function() {
        $(this.buttons[0]).addClass("layer-loading-button");
        $(this.buttons[0]).removeClass("layer-loaded-button");
    },

    layerLoadingEnd: function() {
        $(this.buttons[0]).removeClass("layer-loading-button");
        $(this.buttons[0]).addClass("layer-loaded-button");
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
