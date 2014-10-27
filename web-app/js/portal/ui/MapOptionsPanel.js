/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapOptionsPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        this.baseLayerCombo = new GeoExt.ux.BaseLayerComboBox({
            map: cfg.map,
            editable: false,
            width: 175,
            padding: 20,
            emptyText: 'Choose a Base Layer'
        });

        this.autoZoomCheckbox = new Ext.form.Checkbox({
            boxLabel: OpenLayers.i18n('autozoom'),
            inputType: 'checkbox',
            checked: cfg.autoZoom
        });
        this.autoZoomCheckbox.addEvents('autozoomchecked', 'autozoomunchecked');
        this.autoZoomCheckbox.on('check', function (box, checked) {
            var event = checked ? 'autozoomchecked' : 'autozoomunchecked';
            box.fireEvent(event, box, checked);
        }, this);

        var config = Ext.apply({
            collapseMode: 'mini',
            id: 'mapOptions',
            padding: 5,
            items: [
                this.autoZoomCheckbox,
                new Ext.Spacer({height: 5}),
                this.baseLayerCombo
            ]
        }, cfg);

        Portal.ui.MapOptionsPanel.superclass.constructor.call(this, config);

        this.relayEvents(this.autoZoomCheckbox, ['autozoomchecked', 'autozoomunchecked']);
    },

    autoZoomEnabled: function () {
        return this.autoZoomCheckbox.getValue();
    }

});
