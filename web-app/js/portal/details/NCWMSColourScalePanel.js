
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.details');

Portal.details.NCWMSColourScalePanel = Ext.extend(Ext.Panel, {

    layout: 'form',

    constructor: function (cfg) {

        var config = Ext.apply({}, cfg);
        Portal.details.NCWMSColourScalePanel.superclass.constructor.call(this, config);
    },

    initComponent: function() {

        this.colourScaleHeader = new Ext.form.Label({
            html: "<h5>Set Parameter Range</h5>"
        });

        this.colourScaleMin = new Ext.form.TextField({
            fieldLabel: "Min",
            //layout:'form',
            enableKeyEvents: true,
            labelStyle: "width:30px",
            ctCls: 'smallIndentInputBox',
            grow: true,
            listeners: {
                scope: this,
                keydown: function(textfield, event) {
                    this.updateScale(textfield, event);
                }
            }
        });

        this.colourScaleMax = new Ext.form.TextField({
            fieldLabel: "Max",
            enableKeyEvents: true,
            labelStyle: "width:30px",
            ctCls: 'smallIndentInputBox',
            grow: true,
            listeners: {
                scope: this,
                keydown: function(textfield, event) {
                    this.updateScale(textfield, event);
                }
            }
        });


        this.items = [
            this.colourScaleHeader,
            this.colourScaleMax,
            this.colourScaleMin
        ];

        Portal.details.NCWMSColourScalePanel.superclass.initComponent.call(this);
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

    updateScale: function(textfield, event) {
        //return key
        if (event.getKey() == 13) {

            var scaleMin = parseFloat(this.colourScaleMin.getValue());
            var scaleMax = parseFloat(this.colourScaleMax.getValue());
            console.log(scaleMax > scaleMin);
            console.log((!isNaN(scaleMin) && !isNaN(scaleMax)));

            if ( scaleMax > scaleMin && (!isNaN(scaleMin) && !isNaN(scaleMax))) {

                this.selectedLayer.mergeNewParams({
                    COLORSCALERANGE: this.colourScaleMin.getValue() + "," + this.colourScaleMax.getValue()
                });

                Ext.getCmp(this.stylePanelId).refreshLegend(this.selectedLayer);

                // set the user selected range
                this.selectedLayer.metadata.userScaleRange = [this.colourScaleMin.getValue(),this.colourScaleMax.getValue()];
            }
            else if (isNaN(scaleMin) || isNaN(scaleMax)) {
                alert(OpenLayers.i18n('colourScaleEmptyValuesError'));
            }
            else {
                alert(OpenLayers.i18n('colourScaleError'));
            }
        }
    }
});
