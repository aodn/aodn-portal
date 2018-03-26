Ext.namespace('Portal.ui');

Portal.ui.TimeRangeLabel = Ext.extend(Ext.Panel, {

    constructor: function(cfg) {
        var config = Ext.apply({}, cfg);

        Portal.ui.TimeRangeLabel.superclass.constructor.call(this, config);
    },

    updateValues: function(layer, elevation) {

        if (layer.time) {
            var units = (layer.extraLayerInfo.zaxis) ? layer.extraLayerInfo.zaxis.units : "(Unknown units)";

            var elevationString = (elevation != undefined) ? String.format(" at {0}{1}", elevation, units) : "";
            var time = layer.time.toUtcDisplayFormat();

            this.update(
                String.format(
                    "<p class=\"nowrap\" ><i><b>{0}</b>: {1} {2}</i></p>",
                    OpenLayers.i18n('currentDateTimeLabel'), time, elevationString)
            );
        }
    },

    loading: function() {
        this.update(this._loadingMessage());
    },

    _loadingMessage: function() {
        return String.format("<i>{0}</i>", OpenLayers.i18n("loadingResourceMessage", {resource: 'map information'}));
    }
});
