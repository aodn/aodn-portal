/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui');

Portal.ui.MapOptionsPanel = Ext.extend(Ext.Panel, {

    constructor: function (cfg) {

        this.snapshotController = new Portal.snapshot.SnapshotController({
            map: cfg.map,
            mapScope: cfg.mapScope
        });

        this.snapshotController.on('snapshotLoaded', function () {
            this.fireRemoveAllLayers();
        }, this);

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

        this.snapshotOptionsPanel = new Portal.snapshot.SnapshotOptionsPanel({
            controller: this.snapshotController,
            map: cfg.map
        });

        this.initButtonPanel();

        var config = Ext.apply({
            collapseMode: 'mini',
            id: 'mapOptions',
            padding: 5,
            items: [
                new Ext.Panel({
                    height: 20,
                    items: [
                        {
                            flex: 3,
                            items: [
                                this.autoZoomCheckbox
                            ]
                        }
                    ]
                }),
                new Ext.Spacer({height: 5}),
                this.buttonPanel,
                new Ext.Spacer({height: 2}),
                this.snapshotOptionsPanel,
                this.baseLayerCombo
            ]
        }, cfg);

        Portal.ui.MapOptionsPanel.superclass.constructor.call(this, config);

        this.relayEvents(this.autoZoomCheckbox, ['autozoomchecked', 'autozoomunchecked']);
    },

    initButtonPanel: function () {
        this.buttonPanel = new Ext.Panel({
            border: true,
            flex: 1,
            items: [
                {
                    xtype: 'button',
                    text: OpenLayers.i18n("clearAllButtonLabel"),
                    cls: "floatLeft buttonPad",
                    scope: this,
                    handler: this._clearAll
                }
            ]
        });
    },

    _clearAll: function () {
        Portal.data.ActiveGeoNetworkRecordStore.instance().removeAll();
    },

    autoZoomEnabled: function () {
        return this.autoZoomCheckbox.getValue();
    },

    fireRemoveAllLayers: function () {
        this.fireEvent('removealllayers');
    }
});
