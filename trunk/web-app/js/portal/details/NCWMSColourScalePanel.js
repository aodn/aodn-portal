Ext.namespace('Portal.details');

Portal.details.NCWMSColourScalePanel = Ext.extend(Ext.Panel, {
    layout: 'form',
    id: 'ncWMSColourScalePanel',

    initComponent: function(){
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
                keydown: function(textfield, event){
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
                keydown: function(textfield, event){
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

        // see if the user has changed these values
        if (layer.metadata.userScaleRange != undefined) {
            this.colourScaleMin.setValue(layer.metadata.userScaleRange[0]);
            this.colourScaleMax.setValue(layer.metadata.userScaleRange[1]);
        }
        else if (layer.metadata.scaleRange != undefined) {
            this.colourScaleMin.setValue(layer.metadata.scaleRange[0]);
            this.colourScaleMax.setValue(layer.metadata.scaleRange[1]);
        }
        this.show();
    },

    updateScale: function(textfield, event){
        //return key
        if(event.getKey() == 13){
            if ( parseFloat(this.colourScaleMax.getValue()) > parseFloat(this.colourScaleMin.getValue())) {

                this.selectedLayer.mergeNewParams({
                    COLORSCALERANGE: this.colourScaleMin.getValue() + "," + this.colourScaleMax.getValue()
                });
                Ext.getCmp('stylePanel').refreshLegend(this.selectedLayer);

                // set the user selected range
                this.selectedLayer.metadata.userScaleRange = [this.colourScaleMin.getValue(),this.colourScaleMax.getValue()];
            }
            else {
                alert("The Max Parameter Range value is less than the Min");
            }
        }
    }
});