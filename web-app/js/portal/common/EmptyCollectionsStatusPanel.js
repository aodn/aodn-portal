/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.common');

Portal.common.EmptyCollectionStatusPanel = Ext.extend(Ext.Panel, {

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
        return OpenLayers.i18n('noActiveCollectionSelected') + "<br/><i><small>" + OpenLayers.i18n('noCollectionSelectedHelp') + "</small></i>"
    }

});