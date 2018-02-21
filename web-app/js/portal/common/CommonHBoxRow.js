Ext.namespace('Portal.common');

Portal.common.CommonHBoxRowPanel = Ext.extend(Ext.Panel, {

    ROW_HEIGHT: 32,
    ROW_WIDTH: 270,

    constructor: function(cfg) {

        Ext.apply(this, cfg);
        Portal.common.CommonHBoxRowPanel.superclass.constructor.call(this, arguments);
    },

    initComponent: function(cfg) {

        var config = Ext.apply({
            layout: 'hbox',
            layoutConfig: {
                align: 'middle'
            },
            width: this.ROW_WIDTH,
            height: this.ROW_HEIGHT,
            items: [
                this._createHBoxLabel(this.label),
                this.field
            ]
        }, cfg);

        Ext.apply(this, config);
        Portal.common.CommonHBoxRowPanel.superclass.initComponent.apply(this, arguments);
    },

    _createHBoxLabel: function(text) {
        return new Ext.form.Label({
            html: text,
            width: 40
        });
    }
});