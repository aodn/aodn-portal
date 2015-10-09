Ext.namespace('Portal.ui');

Portal.ui.TimeRangeLabel = Ext.extend(Ext.form.Label, {

    constructor: function(cfg) {
        var config = Ext.apply({
            html: this._loadingMessage()
        }, cfg);

        Portal.ui.TimeRangeLabel.superclass.constructor.call(this, config);
    },

    updateTime: function(time) {

        this.setText(
            String.format(
                "<small><i><b>{0}</b>: {1}<br/></i></small>",
                OpenLayers.i18n('currentDateTimeLabel'), time),
            false
        );
    },

    loading: function() {
        this.setText(this._loadingMessage(), false);
    },

    _loadingMessage: function() {
        return String.format("<i>{0}</i>", OpenLayers.i18n("loadingMessage"));
    }
});
