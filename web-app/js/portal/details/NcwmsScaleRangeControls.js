/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.NcwmsScaleRangeControls = Ext.extend(Ext.Panel, {

    layout: 'form',

    initComponent: function() {

        this.colourScaleHeader = new Ext.form.Label({
            html: "<h5>Set Parameter Range</h5>"
        });

        this.colourScaleMin = this.makeSmallIndentInputBox("Min");
        this.colourScaleMax = this.makeSmallIndentInputBox("Max");

        this.goButton = new Ext.Button({
            text: OpenLayers.i18n("goButton"),
            width: 65,
            disabled: true,
            listeners: {
                scope: this,
                click: this.applyNewScale
            }
        });

        this.items = [
            new Ext.Spacer({
                height: 10
            }),
            this.colourScaleHeader,
            this.colourScaleMax,
            this.colourScaleMin,
            this.goButton
        ];

        this.addEvents('colourScaleUpdated');
        Portal.details.NcwmsScaleRangeControls.superclass.initComponent.call(this);

        this.dataCollection.getLayerState().on('selectedlayerchanged', this.loadScaleFromLayer, this);
    },

    makeSmallIndentInputBox: function(fieldLabel) {
        return new Ext.form.TextField({
            fieldLabel: fieldLabel,
            enableKeyEvents: true,
            width: 75,
            labelStyle: "width:30px",
            ctCls: 'smallIndentInputBox',
            listeners: {
                scope: this,
                keyup: this.updateGoButton
            }
        });
    },

    loadScaleFromLayer: function() {

        var layerState = this.dataCollection.getLayerState();
        var range = layerState.getScaleRange();

        this.colourScaleMin.setValue(range.min);
        this.colourScaleMax.setValue(range.max);

        this.show();
    },

    _canSubmit: function() {
        var scaleMin = (this.colourScaleMin.getValue().length == 0) ? undefined : parseFloat(this.colourScaleMin.getValue());
        var scaleMax = (this.colourScaleMax.getValue().length == 0) ? undefined : parseFloat(this.colourScaleMax.getValue());
        return (!isNaN(scaleMin) && !isNaN(scaleMax) && (scaleMax > scaleMin));
    },

    updateGoButton: function() {
        this.goButton.setDisabled(!this._canSubmit());
    },

    applyNewScale: function() {

        if (this._canSubmit()) {

            var layerState = this.dataCollection.getLayerState();
            var min = this.colourScaleMin.getValue();
            var max = this.colourScaleMax.getValue();
            layerState.setScaleRange(min, max);

            this.fireEvent('colourScaleUpdated');
        }
    }
});
