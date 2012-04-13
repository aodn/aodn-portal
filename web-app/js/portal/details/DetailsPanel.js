Ext.namespace('Portal.details');

Portal.details.DetailsPanel = Ext.extend(Ext.TabPanel, {
    defaults: {
        margin: 10
    },
    id: 'detailsPanelTabs',
    ref: 'detailsPanelTabs',
    border: false,
    activeTab: 0,
    enableTabScroll: true,
    cls: 'floatingDetailsPanelContent',

    initComponent: function(){
        //this.stylePanel = new Portal.details.StylePanel();
        this.opacitySlider = new Ext.slider.SingleSlider({
            id: "opacitySlider",
            title: 'Opacity',
            layer: "layer",
            minValue: 20, // we dont want a user to be able to give zero vis
            maxValue: 100,
            margins: {
                top: 0,
                right: 10,
                bottom: 10,
                left: 10
            },
            inverse: false,
            fieldLabel: "Opacity",
            plugins: new GeoExt.LayerOpacitySliderTip({
                template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
            }),
            listeners: {
                // call show when a layer is chosen so we can access this listener
                show: function(slider) {
                    slider.setValue(0,selectedLayer.server.opacity,true);
                },
                changeComplete: function(slider, val, thumb){
                    selectedLayer.setOpacity(val / 100);
                }
            }
        });


        this.items = [
            //featureInfoPanel, // implement when there is something to see
            this.opacitySlider,
            //this.stylePanel//,
            //TODO: add animatePanel back in
            //animatePanel
        ]

        Portal.details.DetailsPanel.superclass.initComponent.call(this);
    }
});