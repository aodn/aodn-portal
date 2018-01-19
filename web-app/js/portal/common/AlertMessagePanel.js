Ext.namespace('Portal.common');

Portal.common.AlertMessagePanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        this.messageCss =  (cfg && cfg.messageCss != undefined) ? cfg.messageCss: "alert-warning";

        Ext.apply(this, cfg);
        Portal.common.AlertMessagePanel.superclass.constructor.call(this, arguments);
    },

    initComponent: function(cfg) {

        var config = Ext.apply({
            autoEl: 'div',
            hidden: true,
            items: [
                this._createVerticalSpacer(10),
                {
                    cls: "alert " + this.messageCss,
                    html: this.message
                }
            ]
        }, cfg);


        Ext.apply(this, config);
        Portal.common.AlertMessagePanel.superclass.initComponent.apply(this, arguments);
    },

    _createVerticalSpacer: function(sizeInPixels) {
        return new Ext.Spacer({
            cls: 'block',
            height: sizeInPixels
        });
    }

});