Ext.namespace('Portal.details');

Portal.details.AnimationPanel = Ext.extend(Ext.Panel, {
    title: 'Date Animate',
    id: 'animationPanel',
    plain: true,
    stateful: false,
    autoScroll: true,
    bodyCls: 'floatingDetailsPanel',
    height: 400,

    initComponent: function(){
    	this.animatedLayers = undefined;
        this.oneDayOnlyLabel = new Ext.form.Label();

        this.noAnimationLabel = new Ext.form.Label({
        	hidden: true,
        	html: "This layer cannot be animated"
        });

        this.timeMax = new Ext.form.TextField({
			ref: 'timeMax',
			fieldLabel: "End ",
			disabled: true, // readonly
			grow: true,
			labelStyle: "width:50px",
			ctCls: 'smallIndentInputBox'
		});

		this.timeMin = new Ext.form.TextField({
		   ref: 'timeMin',
			fieldLabel: "Start ",
			disabled: true, // readonly
			grow: true,
			labelStyle: "width:50px",
			ctCls: 'smallIndentInputBox'
		});

		this.frameCount =  new Ext.form.TextField({
			ref: 'frameCount',
			fieldLabel: "Days",
			disabled: true, // readonly
			grow: true,
			//text: this.selectedLayer.dates.length,
			labelStyle: "width:50px",
			//labelStyle: "",
			ctCls: 'smallIndentInputBox'
		});

		this.startAnimationButton = new Ext.Button({
			id: 'startNCAnimationButton',
			text:'Start',
			disabled: false, // readonly
			//hidden: true,
			listeners: {
				scope: this,
				'click': function(button,event){
					this.getTimePeriod();
				}
			}
		});

		this.label = new Ext.form.Label({
			html: "<h4>Select Time Period</h4>"
		});

		this.stopNCAnimationButton = new Ext.Button({
			id: 'stopNCAnimationButton',
			text:'Stop',
			hidden: true,
			listeners:{
				scope: this,
				// Until the details panel is refactored just grab a handle via Ext
				'click': function(button,event) {
					// Note selected layer is a global variable that also should be refactored
					Ext.getCmp('map').stopAnimation(this.selectedLayer);
					this.startAnimationButton.setVisible(true);
					this.stopNCAnimationButton.hide();
				}
			}
		});

		this.timePanel = new Ext.Panel({
			hidden: true,
			id: 'theOnlyTimePanel',
			ref: 'theOnlyTimePanel',
			layout: 'form',
			items: [
				this.label,
				this.timeMax,
				this.timeMin,
				this.frameCount,
				this.startAnimationButton,
				this.stopNCAnimationButton
			]
		});

        this.stepSlider = new Ext.Slider({
			id: 'stepSlider',
			ref: 'stepSlider',
			width: 250
		});

		var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';

		var fields = [{
			name: 'index'
		},{
			name: 'displayText'
		}];

		var valueStore  = new Ext.data.ArrayStore({
			autoDestroy: true,
			name: "time",
			fields: fields
		});

		this.startTimeCombo = new Ext.form.ComboBox({
			id: "startTimePicker",
			fieldLabel: 'Start: ',
			triggerAction: 'all',
			editable : false,
			lazyRender:true,
			mode: 'local',
			store: valueStore,
			valueField: 'index',
			displayField: 'displayText',
			store: valueStore,
			tpl: '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>'
		});

		this.endTimeCombo = new Ext.form.ComboBox({
			id: "endTimePicker",
			fieldLabel: 'End: ',
			triggerAction: 'all',
			editable : false,
			lazyRender:true,
			mode: 'local',
			store: valueStore,
			valueField: 'index',
			displayField: 'displayText',
			store: valueStore,
			tpl: '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>'
		});

		this.playButton = new Ext.Button({
			id: 'Play',
			disabled: false, // readonly
			icon: 'images/animation/play.png',
			listeners: {
				scope: this,
				'click': function(button,event){
					this.loadAnimation();
				}
			}
		});


		this.animatePanelContent = new Ext.Panel({
			id: 'animatePanelContent',
			layout: 'form',
			items: [
				this.noAnimationLabel,
				this.oneDayOnlyLabel,
				this.timePanel,
				this.startTimeCombo,
				this.endTimeCombo,
				this.playButton,
				this.stepSlider
			]
		});


        this.items = [
            this.animatePanelContent
        ];

        Portal.details.AnimationPanel.superclass.initComponent.call(this);
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
    },

    cycleAnimation: function(){
        if(this.counter < this.animatedLayers.length){
        	console.log("cycleAnimation " + this.counter);
			this.counter++;
        }
        else{
        	this.counter = 0;
        	console.log("cycleAnimation " + this.counter);
        }

        index = 0;
        for(var i = 0; i < this.animatedLayers.length; i++){
        	if(i == this.counter){
				this.animatedLayers[i].display(true);
			}
			else{
				this.animatedLayers[i].display(false);
			}
			index++;
		}
    },

    loadAnimation: function(){
    	if(this.startTimeCombo.getValue() > this.endTimeCombo.getValue()){
			alert("You must select an end date that is later than the start date");
		}

    	else{
    		if(this.animatedLayers == undefined){
    			//this will be an Map.  Key = openlayer, value = flag whether a layer has been loaded
    			this.animatedLayers = new Array();
    			this.totalSlides = 0;

    			timeDimension = this.getSelectedLayerTimeDimension();
				map = Ext.getCmp("map");

				if(timeDimension != null){
					extentValues =  timeDimension.extent.split(",");

					//load each and every layer?
					startIndex = this.startTimeCombo.getValue();
					endIndex = this.endTimeCombo.getValue();

					for(var i = startIndex; i <= endIndex; i++){
						var layer = this.selectedLayer.clone();
						layer.name = this.selectedLayer.name + " (" + extentValues[i] + ")";
						layer.mergeNewParams({
							TIME: extentValues[i]
						});

						this.animatedLayers.push(layer);
						console.log(layer);
						/* TODO: FORGET ABOUT THIS FOR NOW
						layer.events.register("loadend", this, function(e) {
							this.animatedLayers[e.object] =  true;
						});*/

						map.addLayer(layer);
					}

					var inst = this;
                    this.counter = 0;
					this.timerId = setInterval(function(){
						console.log("setting up intervall..");
						inst.cycleAnimation();
					}, 1000);

					//should disable some of the buttons...
					this.startTimeCombo.disable();
					this.endTimeCombo.disable();
					this.playButton.disable();
				}
    		}
		}
    },



    setupAnimationControl: function() {

        if (this.selectedLayer == undefined) {
            return false;
        }

        var newAnimatePanelContents = undefined;

        if (this.selectedLayer.dates.length == 1) {
            this.oneDayOnlyLabel.setText("Only one day is available - " + this.selectedLayer.dates[0].date);
            this.oneDayOnlyLabel.show();
        }
        else if (this.selectedLayer.dates.length > 1){
            if (this.animatePanelContent.timePanel == undefined) {
            	this.timePanel.show();
            }
			// update it\
			this.setTimeVals(this.timePanel.timePanelSlider);
        }
        //this.setDisabled(false);
        this.animatePanelContent.doLayout();
    },

    update: function(){
        //Just hide everything by default
        this.timePanel.hide();
		this.oneDayOnlyLabel.hide();
		this.noAnimationLabel.hide();

        if(this.selectedLayer.server.type.search("NCWMS") > -1){
        	if (this.selectedLayer.originalWMSLayer != undefined) {
				// set the Start Stop buttons;
				//this.stopNCAnimationButton.setVisible(false);
				this.timePanel.setVisible(true);
				this.timeSlider.disable();
				this.startAnimationButton.hide();
				this.stopNCAnimationButton.setVisible(true);
			}
			else{
				//if no dates has been fetched, then grab them.  Otherwise, just use the cached
				//this.selectedLayer.dates.  No need for extra AJAX requests!
				if(this.selectedLayer.dates == undefined || (this.selectedLayer.dates.length == 0)){
					this.setLayerDates();
					this.setLayerDatesByCapability();
                }

				this.setupAnimationControl();
			}

        }
        else{
        	this.noAnimationLabel.setVisible(true);
        }
    },

    setLayerDatesByCapability: function(){

    	if(this.selectedLayer != null && this.selectedLayer.dimensions != null){
    		var capDates = new Array();
    		for(var i = 0; i < this.selectedLayer.dimensions.length; i++){
    			var dim = this.selectedLayer.dimensions[i];

    			if(dim.name == "time"){
    				splitDates = dim.extent.split(",");
    				for(var j = 0; j < splitDates.length; j++){
    					d = Date.parseDate(splitDates[j], "c");
    					capDates.push([j, splitDates[j]]);
    				}

                    this.startTimeCombo.store.loadData(capDates);
                    this.endTimeCombo.store.loadData(capDates);
    			}
    		}



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
                        this.setDatetimesForDate(newDay);
                        dayCounter ++;
                    }
                }
            }
        }

        // store with the layer.
        // set to undefined when setDatetimesForDate returns a result for every day
        this.selectedLayer.dayCounter = dayCounter;
    },

	setDatetimesForDate: function(day) {
		var url;
		// see if this layer is flagged a 'cached' layer. a Cached layer is allready requested through our proxy
		if (this.selectedLayer.cache === true) {
		   url = this.selectedLayer.server.uri;
		   url = proxyCachedURL + encodeURIComponent(this.selectedLayer.server.uri) +  "?request=GetMetadata&item=timesteps&layerName=" +  this.selectedLayer.params.LAYERS +   "&day=" + day;
		}
		else {
		   url = this.selectedLayer.url;
		   url = proxyURL+encodeURIComponent(url +  "?request=GetMetadata&item=timesteps&layerName=" +  this.selectedLayer.params.LAYERS +   "&day=" + day);
		}

		// getMetadata gave us the days but not the times of the day
		Ext.Ajax.request({
			scope: this,
			url: url,
			success: function(resp) {

				var res = Ext.util.JSON.decode(resp.responseText);
				var dateTimes = [];

				for(var i=0; i<res.timesteps.length; i++) {
					dateTimes.push(day +  "T" + res.timesteps[i]);
				}
				// store the datetimes for each day
				for(var i=0; i<this.selectedLayer.dates.length; i++) {
					if (this.selectedLayer.dates[i].date == day) {
						this.selectedLayer.dates[i].dateTimes = dateTimes;
					}
				}

				this.selectedLayer.dayCounter--;

				// set to undef when setDatetimesForDate returns a result for every day
				// now we are safe to allow animation
				if (this.selectedLayer.dayCounter == 0) {
					this.selectedLayer.dayCounter = undefined;
					// a user may now try and pick a date to animate
					this.startAnimationButton.setDisabled(false);
					// The 'Start' button can be shown, but it may not be rendered yet
					// try to enable in the render listener as well
					// then animation can then procede
					if (this.startAnimationButton != undefined) {
						this.startAnimationButton.enable();
					}
				}

			}
		});
	},

	setTimeVals: function(slider) {

		if(this.selectedLayer.originaWMSLayer == undefined){
			this.timePanel.remove('timePanelSlider');
			var dates = this.selectedLayer.dates;

			//TODO: maybe use the "update" method instead of recreating the slider bar everytime?!?
			if(dates.length > 0){
				this.timeSlider = new Ext.Slider({
			        id: 'timePanelSlider',
					ref: 'timePanelSlider',
					width: 250,
					values:  [0,this.selectedLayer.dates.length-1],
					minValue: 0,
					maxValue: this.selectedLayer.dates.length-1,
					plugins: new Ext.ux.SliderTip({
						dates: this.selectedLayer.dates,
						getText: function(slider){
							var thumbName = "Start";
							if (slider.index != 0) {
								thumbName = "End";
							}
							return String.format('<b>{0}:</b> {1}', thumbName,  dates[slider.value].date);
						}
					}),
					listeners: {
						scope: this,
						changecomplete: function(slider,val,thumb) {
							// which ever thumb was moved, update the selectedLayer
							this.updateTimeLabels();
						}
					}
				});

				this.timePanel.insert(1, this.timeSlider);
               	this.updateTimeLabels(dates);
				this.doLayout();
			}
		}
	},

	updateTimeLabels: function(){
		dates = this.selectedLayer.dates;
		this.timeMin.setValue(dates[this.timeSlider.getValues()[0]].date);

		if (this.timeSlider.getValues()[1] != undefined) {
			this.timeMax.setValue(dates[this.timeSlider.getValues()[1]].date);
			this.frameCount.setValue(this.timeSlider.getValues()[1] -  this.timeSlider.getValues()[0] + 1); // + item at zero
		}
		else {
			this.timeMax.setValue(undefined);
			this.frameCount.setValue(undefined);
		}
	},

	setSelectedLayer: function(layer){
		this.selectedLayer = layer;
	},

	getTimePeriod: function() {
		var chosenTimes = [];

		var url;
		// see if this layer is flagged a 'cached' layer. a Cached layer is already requested through our proxy
		if (this.selectedLayer.cache === true) {
		   url = this.selectedLayer.server.uri;
		}
		else {
		   url = this.selectedLayer.url;
		}

		// get the server to tell us the options
		Ext.Ajax.request({
			scope: this,
			url: proxyURL+encodeURIComponent(url +
				"?request=GetMetadata&item=animationTimesteps&layerName=" +
				this.selectedLayer.params.LAYERS +
				"&start=" + this.getDateTimesForDate(this.timePanel.timeMin.value)[0] +
				"&end=" + this.getDateTimesForDate(this.timePanel.timeMax.value)[0]
			),
			success: function(resp) {
				var res = Ext.util.JSON.decode(resp.responseText);

				if (res.timeStrings != undefined) {
					// popup a window
					this.showTimestepPicker(res.timeStrings);
				}
			}
		});
	},
	// use to get the allready stored dateTimes for date
	// for the selectedLayer
	getDateTimesForDate: function(day) {
		var dateTimes = [];
		for(var i=0; i<this.selectedLayer.dates.length; i++) {
			if (this.selectedLayer.dates[i].date == day) {
				dateTimes = this.selectedLayer.dates[i].dateTimes;
			}
		}
		return dateTimes;

	},

	// modal timestep picker for animating current layer
	showTimestepPicker: function(timeStrings) {

		// copy to the attributes needed by the Ext radioGroup
		for (vars in timeStrings) {
			timeStrings[vars].boxLabel = timeStrings[vars].title;
			timeStrings[vars].name = "justaname";
		}

		var timestepWindow =  new Ext.Window({

			id: 'timestepWindow',
			modal:true,
			padding: '5px 10px',
			shadow: false,
			title: 'Choose Animation Period',
			autoDestroy: true,
			constrainHeader: true,
			constrain: true,
			autoScroll: true,
			border: false,
			items: [
			{
				xtype: 'label',
				style: {
					padding: '10px'
				},
				html: "<p>Please select the number of frames required.<BR>Selecting less frames will result in better performance</p>"
			},
			{
				// Use the default, automatic layout to distribute the controls evenly
				// across a single row
				xtype: 'radiogroup',
				fieldLabel: 'Auto Layout',
				style: {
					padding: '10px'
				},
				columns: 1,
				items: [
				timeStrings
				],
				listeners: {
					scope: this,
					change: function( field, newValue, oldValue, eOpts ) {
						Ext.getCmp('timestepWindow').destroy(); // this components parent window
						this.createNCWMSLayerFromTimesteps(newValue.initialConfig.timeString);
					}
				}
			}
			]
		});

		timestepWindow.show();
	},

	createNCWMSLayerFromTimesteps: function(timeSteps) {
		this.selectedLayer.chosenTimes = timeSteps;
		this.addNCWMSLayer();
	},

	addNCWMSLayer: function() {
        // Wrap the Map call, this function used to live in mainMapPanel.js
    	getMapPanel().addNCWMSLayer(this.selectedLayer);
    },

    getSelectedLayerTimeDimension: function(){
    	if((this.selectedLayer != undefined) && (this.selectedLayer.dimensions != undefined)){
    		for(var i = 0; i < this.selectedLayer.dimensions.length; i++){
    			if(this.selectedLayer.dimensions[i].name == "time"){
    				return this.selectedLayer.dimensions[i];
    			}
    		}
    	}
    	return null;
    }
});