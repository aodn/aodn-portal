Ext.namespace('Portal.ui.openlayers');

Portal.ui.openlayers.LayerSwitcher = Ext.extend(OpenLayers.Control.LayerSwitcher, {

    onButtonClick: function(evt) {

        var button = evt.buttonElement;

        if (button._layer) {

            var layer = this.map.getLayer(button._layer);

            // tracking baselayer being switched "on" or the dataLayers chosen visibility
            var intendedVisibility = (button.type == "radio") ? true : !layer.visibility;

            var state = (intendedVisibility) ? "on" : "off";
            var type = (layer.isBaseLayer) ? "baseLayer" : "dataLayer";

            var action = String.format("{0} ({1})", OpenLayers.i18n('layerControlTrackingActionVisibility'), type);
            trackLayerControlUsage(action, state, layer.name);
        }

        OpenLayers.Control.LayerSwitcher.prototype.onButtonClick.apply(this, arguments);
    }

});