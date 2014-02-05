/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.TimeRangeLabel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {
        var config = Ext.apply({
            autoEl: 'div',
            html: this._loadingMessage()
        }, cfg);

        Portal.ui.TimeRangeLabel.superclass.constructor.call(this, config);
    },

    updateTime: function(time) {
        if (this.isVisible()) {
            this.update(String.format("<small><i><b>{0}</b>: {1}<br/></i></small>", OpenLayers.i18n('currentDateTimeLabel'), time));
        }
    },

    loading: function() {
        this.update(this._loadingMessage());
    },

    _loadingMessage: function() {
        return String.format("<i>{0}</i>", OpenLayers.i18n("loadingMessage"));
    }

});
