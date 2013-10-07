
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
        this.buttons = {};
    },

    render: function(bulkRender) {

        Portal.ui.ActiveLayersTreeNodeUI.superclass.render.apply(this, arguments);
        this.addButtons();
    },

    addButtons: function() {
        var cb = this.checkbox;
        var node = this;

        var that = this;
        if (!this.buttonsRendered) {
            Ext.each([
                    {
                        tooltip: '',
                        cls: '',
                        name: 'loadingStatus'
                    },
                    {
                        tooltip: OpenLayers.i18n('removeDataCollection'),
                        cls: 'remove-layer-button',
                        clickHandler: this.removeLayer,
                        name: 'remove'
                    },
                    {
                        tooltip: OpenLayers.i18n('zoomToDataCollection'),
                        cls: 'zoom-to-layer-button',
                        clickHandler: this.zoomToLayer,
                        name: 'zoom'
                    }
                ],
                function(item) {
                    var button = Ext.DomHelper.insertBefore(
                        cb,
                        "<input type='button' class='" + item.cls + "' title='" + item.tooltip + "'/>"
                    );
                    that.buttons[item.name] = button;

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
        this.statusIndicator().
            removeClass("layer-error-button").
            removeClass("layer-loaded-button").
            addClass   ("layer-loading-button");
    },

    layerLoadingEnd: function(loadedWithErrors) {
        var statusButton = this.statusIndicator();

        statusButton.removeClass("layer-loading-button");

        if (loadedWithErrors) {
            statusButton.addClass("layer-error-button");
        } else {
            statusButton.addClass("layer-loaded-button");
        }
    },

    statusIndicator: function() {

        return $(this.buttons['loadingStatus']);
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
