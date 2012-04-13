Ext.namespace('Portal.details');

Portal.details.AnimationPanel = Ext.extend(Ext.Panel, {
    title: 'Date Animate',
    id: 'animationPanel',
    plain: true,
    disabled: true,
    stateful: false,
    autoScroll: true,
    bodyCls: 'floatingDetailsPanel',


    initComponent: function(){
        this.animatePanelContent = new Ext.Panel({
            id: 'animatePanelContent'
        });

        this.items = [
            this.animatePanelContent
        ];

        this.on('show', function(thisComponent){
            // the tabpanel needs to be visible before setup below
            this.setupAnimationControl();
        }, this);

        Portal.details.AnimationPanel.superclass.initComponent.call(this);
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
    },

    setupAnimationControl: function() {

        if (this.selectedLayer == undefined) {
            console.log("animation was requested although no layer is active!!");
            return false;
        }

        this.animatePanelContent.removeAll(true);

        var newAnimatePanelContents = undefined;

        if (this.selectedLayer.dates.length == 1) {

            // todo animate on todays times
            content = new Ext.Panel({
                layout: 'form',
                items: [
                new Ext.form.Label({
                    html:"<p>Only one day is available - " + selectedLayer.dates[0] + "</p>"
                    } )
                ]
            });

            this.animatePanelContent.add(newAnimatePanelContents);

        }
        else {
            console.log("there's times!");
            console.log(this.animatePanelContent.theOnlyTimePanel);
            if (this.animatePanelContent.theOnlyTimePanel == undefined) {
                this.animatePanelContent.add(new Animations.TimePanel());
            }
            else {
                // update it
                this.animatePanelContent.theOnlyTimePanel.setTimeVals(this.animatePanelContent.theOnlyTimePanel.timePanelSlider);
            //console.log("the dates are set. should reneable the start animation button");
            //Ext.getCmp('startNCAnimationButton').enable();
            }
        }


        this.animatePanelContent.doLayout();




    }
});