Ext.namespace('Portal.ui');

Portal.ui.TimeRangeLabel = Ext.extend(Ext.form.Label, {

    constructor: function(cfg) {
        var config = Ext.apply({
            html: this._loadingMessage()
        }, cfg);

        Portal.ui.TimeRangeLabel.superclass.constructor.call(this, config);
    },

    updateValues: function(layer, depth) {

        if (layer.time) {
            var depthUnits = (layer.extraLayerInfo.zaxis) ? layer.extraLayerInfo.zaxis.units : "(Unknown units)";

            var depthString = (depth) ? String.format(" at {0}{1}", depth, depthUnits) : "";
            var time = layer.time.toUtcDisplayFormat();

            this.setText(
                String.format(
                    "<p><i><b>{0}</b>: {1} {2}</i></p>",
                    OpenLayers.i18n('currentDateTimeLabel'), time, depthString),
                false
            );
        }
    },

    loading: function() {
        this.setText(this._loadingMessage(), false);
    },

    _loadingMessage: function() {
        return String.format("<i>{0}</i>", OpenLayers.i18n("loadingMessage"));
    }
});
