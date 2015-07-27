
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.openlayers');

Portal.ui.openlayers.ClickControl = Ext.extend(OpenLayers.Control, {
    defaultHandlerOptions: {
        'single': true,
        'double': true,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    constructor: function (options) {
        this.handlerOptions = Ext.apply({}, this.defaultHandlerOptions);
        OpenLayers.Control.prototype.initialize.apply(this, arguments);

        this.handler = new OpenLayers.Handler.Click(
            this,
            {
                click: this.onClick
            },
            this.handlerOptions
        );
    }
});
