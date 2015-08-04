

Ext.namespace('Portal.common');

Portal.common.EmptyCollectionStatusPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);
        Portal.common.EmptyCollectionStatusPanel.superclass.constructor.call(this, arguments);
    },

    initComponent: function(cfg) {

        var config = Ext.apply({
            html: this.toString(),
            cls: 'x-panel-header'
        }, cfg);

        Ext.apply(this, config);
        Portal.common.EmptyCollectionStatusPanel.superclass.initComponent.apply(this, arguments);
    },

    toString: function() {
        return "<div class=\"message\" >" +
            OpenLayers.i18n('noActiveCollectionSelected') +
            "<p>" + OpenLayers.i18n('noCollectionSelectedHelp') +
            "</p></div>"
    }
});
