/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext4.namespace('Portal.details');

Portal.details.NCWMSColourScalePanel = Ext.extend(Ext.Panel, {

    layout: 'form',

    constructor: function (cfg) {

        var config = Ext4.apply({}, cfg);
        Portal.details.NCWMSColourScalePanel.superclass.constructor.call(this, config);
    },

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
                click: function(button, event) {
                    this.updateScale(button, event);
                }
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
        Portal.details.NCWMSColourScalePanel.superclass.initComponent.call(this);
    },

    makeSmallIndentInputBox: function(fieldLabel) {
        return new Ext.form.TextField({
            fieldLabel: fieldLabel,
            enableKeyEvents: true,
            width: 75,
            labelStyle: "width:30px",
            ctCls: 'smallIndentInputBox',
            grow: true,
            listeners: {
                scope: this,
                keyup: function() {
                    this.setGoButton();
                }
            }
        });
    },

    makeNcWMSColourScale: function(layer) {

        this.selectedLayer = layer;

        if (layer.params && layer.params.COLORSCALERANGE) {
            var range = layer.params.COLORSCALERANGE.split(',');
            this.colourScaleMin.setValue(range[0]);
            this.colourScaleMax.setValue(range[1]);
        }
        else {
            this.colourScaleMin.setValue(undefined);
            this.colourScaleMax.setValue(undefined);
        }

        this.show();
    },

    _canSubmit: function() {
        var scaleMin = (this.colourScaleMin.getValue().length==0) ? undefined : parseFloat(this.colourScaleMin.getValue());
        var scaleMax = (this.colourScaleMax.getValue().length==0) ? undefined : parseFloat(this.colourScaleMax.getValue());
        return (!isNaN(scaleMin) && !isNaN(scaleMax) && (scaleMax > scaleMin));
    },

    setGoButton: function() {
        this.goButton.setDisabled(!this._canSubmit());
    },

    updateScale: function(comp, event) {

        this.setGoButton();

        if ( this._canSubmit()) {

            var scaleMin = parseFloat(this.colourScaleMin.getValue());
            var scaleMax = parseFloat(this.colourScaleMax.getValue());

            this.selectedLayer.mergeNewParams({
                COLORSCALERANGE: this.colourScaleMin.getValue() + "," + this.colourScaleMax.getValue()
            });

            this.fireEvent('colourScaleUpdated');

            // set the user selected range
            this.selectedLayer.metadata.userScaleRange = [this.colourScaleMin.getValue(),this.colourScaleMax.getValue()];

        }
    }
});
