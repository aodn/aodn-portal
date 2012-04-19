Ext.namespace('Portal.details');

Portal.details.AnimationPanel = Ext.extend(Ext.Panel, {
    title: 'Date Animate',
    id: 'animationPanel',
    plain: true,
    disabled: true,
    stateful: false,
    autoScroll: true,
    bodyCls: 'floatingDetailsPanel',
    height: 400,


    initComponent: function(){
        this.animatePanelContent = new Ext.Panel({
            id: 'animatePanelContent'
        });

        this.items = [
            this.animatePanelContent
        ];

        Portal.details.AnimationPanel.superclass.initComponent.call(this);
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
    },

    setupAnimationControl: function() {
        console.log("setting up aniumation control");
        if (this.selectedLayer == undefined) {
            console.log("animation was requested although no layer is active!!");
            return false;
        }

        this.animatePanelContent.removeAll(true);

        var newAnimatePanelContents = undefined;

        console.log(this.selectedLayer.dates);
        if (this.selectedLayer.dates.length == 1) {
            // todo animate on todays times
            content = new Ext.Panel({
                layout: 'form',
                items: [
                new Ext.form.Label({
                    html:"<p>Only one day is available - " + this.selectedLayer.dates[0] + "</p>"
                    } )
                ]
            });

            this.animatePanelContent.add(content);

        }
        else {
            if (this.animatePanelContent.theOnlyTimePanel == undefined) {
                timePanel = new Animations.TimePanel();
                this.animatePanelContent.add(timePanel);
            }
			// update it\
			timePanel.setSelectedLayer(this.selectedLayer);
			this.animatePanelContent.theOnlyTimePanel.setTimeVals(this.animatePanelContent.theOnlyTimePanel.timePanelSlider);

        }
        //this.setDisabled(false);
        this.animatePanelContent.doLayout();
    },

    update: function(){
        // set default visibility of components in this panel
        // disabled until all dates are loaded for the layer if applicable
        //this.setDisabled(true);

        // assume its not an animated image
        //TODO: add this back in
        //this.stopNCAnimationButton.setVisible(false);

        if(this.selectedLayer.server.type.search("NCWMS") > -1){
            this.setLayerDates();
            this.setupAnimationControl();
        }

        // it may be an animated image layer
        if (this.selectedLayer.originalWMSLayer != undefined) {

            // set the Start Stop buttons;
            //this.stopNCAnimationButton.setVisible(false);
            //this.stopNCAnimationButton.setVisible(true);
        }
    },

    // set all the date/times for the layer
    // creates an array (dates) of objects {date,datetimes} for a layer
    setLayerDates: function(){
		// add this new attribute to the layer
        this.selectedLayer.dates = [];

        var datesWithData = this.selectedLayer.metadata.datesWithData;

        var dayCounter = 0; // count of how many days

        for (var year in datesWithData) {
            for (var month in datesWithData[year]) {
                for (var day in datesWithData[year][month]) {
                    // add 1 to the month and number as datesWithData uses a zero-based months
                    // take the value at the index day if its a number
                    if (!isNaN(parseInt(datesWithData[year][month][day]))) {

                        var newDay = year + "-" + pad(parseInt(month)+1, 2 ) +"-" + pad(datesWithData[year][month][day], 2);
                        this.selectedLayer.dates.push({
                            date: newDay
                        });
                        // start off a Ajax request to add the dateTimes for this date
                        setDatetimesForDate(this.selectedLayer, newDay);
                        dayCounter ++;
                    }
                }
            }
        }

        // store with the layer.
        // set to undefined when setDatetimesForDate returns a result for every day
        this.selectedLayer.dayCounter = dayCounter;
    }
});