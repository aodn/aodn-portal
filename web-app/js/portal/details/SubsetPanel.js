/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.SubsetPanel = Ext.extend(Ext.Container, {

    constructor: function(cfg) {

        var panelType = cfg.dataCollection.getSelectedLayer().isNcwms() ?
                Portal.details.NcWmsPanel : Portal.filter.ui.FilterGroupPanel;
        var newPanel = new panelType(cfg);

        var config = Ext.apply({
            title: OpenLayers.i18n('subsetPanelTitle'),
            items: [newPanel]
        }, cfg);

        Portal.details.SubsetPanel.superclass.constructor.call(this, config);
    }
});
