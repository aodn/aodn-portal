Ext.namespace('Portal.details');

Portal.details.AnimationPanel = Ext.extend(Ext.Panel, {
    
	constructor: function(cfg) {
		var config = Ext.apply({
			id: 'animationPanel',
			layout: 'form',
			stateful: false,
			bodyStyle:'padding:6px; margin:2px',
			defaults: {
				cls: 'fullTransparency'
			},
			width: '100%'
		}, cfg);

		Portal.details.AnimationPanel.superclass.constructor.call(this, config);
	},

	initComponent: function(){
		this.BASE_SPEED = 500;
		this.animatedLayers = new Array();		
		var parent = this;

		this.warn = new Ext.form.Label({
			padding: 5,
			width: 280,
			text: OpenLayers.i18n('warn_label')
		});

		this.speedUp = new Ext.Button({
			icon: 'images/animation/last.png',
			plain: true,
			padding: 5,
			listeners: {
				scope: this,
				'click': function(button,event){
					this._resetTimer(this.speed / 2);
				}
			},
			tooltip: OpenLayers.i18n('speedUp')
		});

		this.slowDown = new Ext.Button({
			icon: 'images/animation/first.png',
			padding: 5,
			listeners: {
				scope: this,
				'click': function(button,event){
					this._resetTimer(this.speed * 2);
				}
			},
			tooltip: OpenLayers.i18n('slowDown')
		});

		this.label = new Ext.form.Label({
			html: "<h4>Select Time Period</h4>"
		});

		this.stepSlider = new Ext.slider.SingleSlider({			
			id: 'stepSlider',
			ref: 'stepSlider',			
			width: 120,			
			flex: 3,
			listeners:{
				scope: this,
				drag: function(slider, ev){
					this._setSlide(slider.getValue());
				}
			}
		});

		this.playButton = new Ext.Button({
			id: 'Play',
			padding: 5,
			plain: true,
			disabled: false, // readonly
			icon: 'images/animation/play.png',
			listeners: {
				scope: this,
				'click': function(button,event){
					this._loadAnimation();
				}
			},
			tooltip: OpenLayers.i18n('play')
		});

		this.clearButton = new Ext.Button({
			id: 'Stop',
			padding: 5,
			plain: true,
			icon: 'images/animation/stop.png',
			iconAlign: 'top',
			listeners: {
				scope: this,
				'click': function(button,event){
					this.removeAnimation();
				}
			},
			tooltip: OpenLayers.i18n('clearButton_tip')
		
		});

		this.pauseButton = new Ext.Button({
			id: 'Pause',
			padding: 5,
			disabled: true, // readonly
			icon: 'images/animation/pause.png',
			iconAlign: 'top',
			listeners: {
				scope: this,
				'click': function(button,event){
					clearTimeout(this.timerId);
					this.pausedTime = this.animatedLayers[this.counter].params["TIME"];
					this._toggleButtons(false);
				}
			},
			tooltip: OpenLayers.i18n('pauseButton_tip')
		});

		this.stepLabel = new Ext.form.Label({
			flex: 1,
			width: 110,
			style: 'padding: 5'
		});

		this.progressLabel = new Ext.form.Label({
		   hidden: true,
		   width: 100,
		   left: 150
		});

		this.speedLabel = new Ext.form.Label({
			hidden: true,
			html: "<br /> " + OpenLayers.i18n('speed'),
			width: 100,
			left: 150
		});

		this.buttonsPanel = new Ext.Panel({
			id: 'playerControlPanel',
			layout: 'hbox',
			plain: true,
			items: [
			this.slowDown,
			this.playButton,
			this.pauseButton,
			this.speedUp,
			this.clearButton
			],
			height: 40,
			flex: 2
		});

		this.startDatePicker = new Ext.form.DateField({
			fieldLabel: OpenLayers.i18n('start'),
			id: 'startDatePicker',
			format: 'd-m-Y',
			editable: false,
			listeners:{
				scope: this,
            	select: this._onDateSelected
			}
			
		});

		this.endDatePicker = new Ext.form.DateField({
			fieldLabel: OpenLayers.i18n('end'),
			id: 'endDatePicker',
			format: 'd-m-Y',
			editable: false,
			listeners:{
				scope: this,
				select: this._onDateSelected
			}
		});

		this.startTimeCombo = new Ext.form.ComboBox({
			store: new Array(),
			id: "startTimeCombo",
			triggerAction: "all",
			editable: false,
			listeners:{
				scope: this,
				select: function(combo, record, index){
					timeStr = this._getSelectedTimeString(true);
					this.selectedLayer.mergeNewParams({
						TIME: timeStr
					});
					this.stepLabel.setText(timeStr);
				}
			}
		});
		this.endTimeCombo = new Ext.form.ComboBox({
			store: new Array(),
			id: "endTimeCombo",
			triggerAction: "all",
			editable: false
		});

		this.timeSelectorPanel = new Ext.Panel({
			id: 'timeSelectorPanel',
			layout: 'form',
			plain: true,
			items:[
			this.startDatePicker,
			this.startTimeCombo,
			this.endDatePicker,
			this.endTimeCombo
			]
		});
		
		this.controlPanel = new Ext.Panel({
			layout: 'form',
			plain: true,
			items: [
			{
				xtype: 'container',					
				defaultMargins: "15 5 20 5",
				layout: {
					type: 'hbox',
					pack: 'start'
					   
				},
				items: [						
				this.buttonsPanel,	
				this.stepSlider,					
				this.stepLabel
				],
				listeners:{
					// stops the click bubbling to a getFeatureInfo request on the map
					//scope: this,
					render: function(p){
						p.getEl().on('mouseenter', function(){
							parent._modMapDragging(false);
						});
						p.getEl().on('mouseleave', function(){
							parent._modMapDragging(true);
						});
					}
				}					
			},
			this.timeSelectorPanel,	
			this.progressLabel,
			this.speedLabel
			],
			width: 360,
			height: '100%'
		});

		this.items = [
		this.controlPanel
		];

		this._resetForNewAnimation();
		this.map = Ext.getCmp("map");

		this.map.map.events.register('moveend', this, this.onMove);

		this.pausedTime = "";
		this.timerId = -1;

		Portal.details.AnimationPanel.superclass.initComponent.call(this);
	},
	
	_modMapDragging: function(toggle) {
		var map = this.map.map;
		for (var i = 0; i< map.controls.length; i++) {
			if ((map.controls[i].displayClass === "olControlNavigation") || (map.controls[i].displayClass === "olControl")){
				if(toggle){
					map.controls[i].activate();
				}
				else{
					 map.controls[i].deactivate();
				}
			}
		}		
	},


	_onDateSelected: function(field, date){
		var combo;

		if(field === this.startDatePicker){
			combo = this.startTimeCombo;
		}
		else{
			combo = this.endTimeCombo;
		}

		var key = date.format("Y-m-d");
		if(this.allTimes[key] != null){
			combo.getStore().loadData(this.allTimes[key], false);
		}
	},

	_resetForNewAnimation: function(){
		this.timerId = -1;
		this.speed = this.BASE_SPEED;
		this.originalOpacity = -1;
		this.pausedTime = "";
		this.allTimes = {};

		//resetting the array
		this.animatedLayers = new Array();
	},

	_toggleButtons: function(playing){
		if(this.animatedLayers.length > 0){
			this.clearButton.enable();
		}

		if(playing){
			//can't change the time when it's playing
			this.playButton.disable();
			this.pauseButton.enable();
			this.stepSlider.enable();
			this.speedUp.enable();
			this.slowDown.enable();
			this.speedLabel.setVisible(true);
		}
		else{
			this.startTimeCombo.enable();
			this.endTimeCombo.enable();
			this.playButton.enable();

			//nothing's playing, so stop and pause doesn't make sense
			this.pauseButton.disable();
			this.speedUp.disable();
			this.slowDown.disable();
			this.speedLabel.setVisible(false);
		}
	},

	_onMove: function(){
		//have to redraw??
		if(this.animatedLayers.length > 0){
			this._setSlide(this.counter);
		}

	},

	removeAnimation: function(){
		if(this.animatedLayers.length > 0){
			clearTimeout(this.timerId);

			if(this.map == null){
				this.map = Ext.getCmp("map");
			}

			this.originalLayer.name = this.originalLayer.name.substr(0, this.originalLayer.name.indexOf(" (animated)"));
			this.originalLayer.setOpacity(this.originalOpacity);

			for(var i = 0; i < this.animatedLayers.length; i++){
				if(this.map.map.getLayer(this.animatedLayers[i].id)){
					this.map.removeLayer(this.animatedLayers[i], this.originalLayer);
				}

				if(this.animatedLayers[i].div != null) {
					if(this.animatedLayers[i].map != null)
						this.animatedLayers[i].destroy();
				}
			}

			//stackoverflow says it's better setting length to zero than to reinitalise array.,.,.,
			this.animatedLayers.length = 0;
			this.stepLabel.setText("", false);

			this.progressLabel.setVisible(false);
			this._toggleButtons(false);

			this._resetForNewAnimation();
			delete this.originalLayer.isAnimated;
		}

	},

	setSelectedLayer: function(layer){
		this.selectedLayer = layer;
	},

	_setSlide: function(index){
		if(this.animatedLayers.length > 0){

			for(var i = 0; i < this.animatedLayers.length; i++){
				this.animatedLayers[i].display(i == index);
			}

			//this should still work even if there's no animation, i.e. paused
			this.stepSlider.setValue(index);
			

			//also set the label
			var labelStr = this.animatedLayers[index].params.TIME;

			this.stepLabel.setText(this.animatedLayers[index].params.TIME, false);
		}
	},

	_cycleAnimation: function(forced){
		this.progressLabel.setText("Loading... " + Math.round((this.counter + 1) / this.animatedLayers.length * 100) + "%");
		this.progressLabel.setVisible(this._isLoadingAnimation());

		if(this.counter < this.animatedLayers.length - 1){
			if(this.map.map.getLayer(this.animatedLayers[this.counter + 1].id) == null){
				this.map.addLayer(this.animatedLayers[this.counter + 1], false);
				this.animatedLayers[this.counter + 1].display(false);
			}
			else{
				if(this.animatedLayers[this.counter + 1].numLoadingTiles == 0){
					this.counter++;
					this._setSlide(this.counter);

				}
			}
		}
		else{
			this.counter = 0;
			this._setSlide(this.counter);

			this.progressLabel.setVisible(false);
		}
	},

	_makeNextSlide: function(timeStamp){
		var newLayer = this.selectedLayer.clone();

		if(this.originalLayer.name.indexOf("animated") > 0){
			newLayer.name = this.originalLayer.name.substr(0, this.originalLayer.name.indexOf(" (animated)"))
			+ " (" + timeStamp + ")";
		}
		else{
			newLayer.name = this.originalLayer.name + " (" +timeStamp + ")";
		}
		newLayer.mergeNewParams({
			TIME: timeStamp
		});

		newLayer.setVisibility(true);
		newLayer.setOpacity(1);
		newLayer.display(false);
		newLayer.isAnimated = true;

		return newLayer;
	},

	_loadAnimation: function(){
		if(this.startDatePicker.getValue() === "" || this.endDatePicker.getValue() === "" ||
			this.startTimeCombo.getValue() === "" || this.endTimeCombo.getValue() === ""){
			//Incomplete start/end time!  Do nothing.
			//Maybe show a message
			return;
		}

		var startString = this._getSelectedTimeString(true);
		var endString = this._getSelectedTimeString(false);

		dimSplit = this.getSelectedLayerTimeDimension().extent.split(",");

		var startIndex = dimSplit.indexOf(startString);
		var endIndex = dimSplit.indexOf(endString);

		if(startIndex == endIndex){
			alert("The start and end time must not be the same");
			return false;
		}

		if(startIndex > endIndex){
			alert("You must select an end date that is later than the start date");
			return false;
		}
		else{

			this.progressLabel.setVisible(true);
			this.originalLayer = this.selectedLayer;
			if(this.originalOpacity == -1)
				this.originalOpacity = this.selectedLayer.opacity;

			if(this.originalLayer.name.indexOf("animated") < 0){
				this.originalLayer.name = this.originalLayer.name + " (animated)";
				this.originalLayer.isAnimated = true;
			}

			newAnimatedLayers = new Array();

			for( var j = startIndex; j <= endIndex; j++){
				var newLayer = null;

				//find existing layer
				if(this.animatedLayers.length > 0){
					for( var i = 0; i < this.animatedLayers.length; i++){
						if(dimSplit[j] === this.animatedLayers[i].params["TIME"]){
							newLayer = this.animatedLayers[i];
						}
					}
				}

				//or create new layer, since it hasn't been animated before
				if(newLayer == null){
					newLayer = this._makeNextSlide(dimSplit[j]);
				}

				newAnimatedLayers.push(newLayer);
			}

			this.animatedLayers = newAnimatedLayers;

			//always pre-load the first one
			this.map.addLayer(this.animatedLayers[0], false);

			this.selectedLayer.setOpacity(0);
			this.stepSlider.setMinValue(0);
			this.stepSlider.setMaxValue(this.animatedLayers.length - 1);

			if(this.pausedTime !== ""){
				this.counter = this._getIndexFromTime(this.pausedTime);
			}
			else{
				this.counter = 0;
			}
			this._resetTimer(this.BASE_SPEED);
			this._toggleButtons(true);
		}
	},

	_resetTimer: function(speed){
		this.speed = speed;
		var inst = this;

		if(this.animatedLayers.length > 0){
			if(this.timerId != -1){
				clearTimeout(this.timerId);
			}

			this.timerId = setInterval(function(){
				inst._cycleAnimation();
			}, speed);

		}

		//more milliseconds between each step, so it's slower!
		if(this.speed > this.BASE_SPEED)
			this.speedLabel.setText("<br/> Speed: x 1/" + (this.speed/this.BASE_SPEED), false );
		else
			this.speedLabel.setText("<br/> Speed: x " + (this.BASE_SPEED/this.speed), false );

	//else no animation is running, so can't change the speed of the animation
	},

	update: function() {
		this.controlPanel.hide();

		if(this.getSelectedLayerTimeDimension() != null && this.getSelectedLayerTimeDimension().extent != null){
			//There's a animation already configured (paused, or playing)
			if(this.animatedLayers.length == 0){
				//no animation has been set yet, so configure the panel
				this._setLayerDatesByCapability();
				this.controlPanel.setVisible(true);
			}
			else if(this.selectedLayer.id == this.originalLayer.id){
				this.controlPanel.setVisible(true);
			}
		}
		else{
			//No time dimension, it's a dud!
			//hide.call(target, this);
		}
	},

	_setDateRange: function(picker, startDate, endDate){
		picker.setMinValue(startDate);
		picker.setMaxValue(endDate);
		picker.setValue(startDate);
	},

	_extractDays: function(dim){
		splitDates = dim.extent.split(",");
		var startDate;
		var endDate;
		this.allTimes = {};

		if(splitDates.length > 0){

			startDate = new Date(splitDates[0]);
			endDate = new Date(splitDates[splitDates.length - 1]);

			//set the start/end date range for both pickers
			this._setDateRange(this.startDatePicker, startDate, endDate);
			this._setDateRange(this.endDatePicker, startDate, endDate);

			//then calculate the missing days
			var missingDays = [];

			for(var j = 0; j < splitDates.length; j++){
				var dayTime = splitDates[j].split("T");
				var dayString = dayTime[0];
				var timeString = dayTime[1];

				if(this.allTimes[dayString] == null){
					this.allTimes[dayString] = new Array();
				}
				this.allTimes[dayString].push(timeString);
			}

			var curDate = new Date(splitDates[0]);


			while(curDate < endDate){
				day =  curDate.toISOString().split("T")[0];

				if(this.allTimes[day] == null){
					missingDays.push(curDate.format("d-m-Y"));
				}
				curDate.setDate(curDate.getDate() + 1);
			}

			if(missingDays.length > 1){
				this.startDatePicker.setDisabledDates(missingDays);
				this.endDatePicker.setDisabledDates(missingDays);
			}


			this._setTime(this.endDatePicker, this.endTimeCombo, splitDates[splitDates.length - 1]);

			if(splitDates.length > 10){
				this._setTime(this.startDatePicker, this.startTimeCombo, splitDates[splitDates.length - 10]);
			}
			else{
				this._setTime(this.startDatePicker, this.startTimeCombo, splitDates[t0]);
			}
		}
	},

	_setLayerDatesByCapability: function(){
		var dim = this.getSelectedLayerTimeDimension();
		if(dim != null){
			this._extractDays(dim);
		//TODO: set default to last 10 timestamp for instant animation
		}

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
	},

	_isLoadingAnimation: function(){
		if(this.animatedLayers.length > 0){
			for(var i = 0; i < this.animatedLayers.length; i++){
				if(this.map.map.getLayer(this.animatedLayers[i].id) == null )
					return true;
				if(this.animatedLayers[i].numLoadingTiles > 0){
					return true;
				}
			}
		}

		return false;
	},

	_getIndexFromTime: function(timeStr){
		if(this.animatedLayers.length > 0){
			for(var i = 0; i < this.animatedLayers.length; i++){
				if(this.animatedLayers[i].params["TIME"] === timeStr)
					return i;
			}
		}

		return -1;
	},

	isAnimating: function(){
		return (this.animatedLayers.length > 0);
	},

	_setTime: function(picker, combo, timestamp){
		var date = timestamp.split("T")[0];
		var time = timestamp.split("T")[1];
		picker.setValue(date);

		this._onDateSelected(picker, new Date(timestamp));
		combo.setValue(time);

	},

	_getSelectedTimeString: function(isStart){
		if(isStart)
    		return this.startDatePicker.getValue().format("Y-m-d") + "T" + this.startTimeCombo.getValue();
    	else
        	return this.endDatePicker.getValue().format("Y-m-d") + "T" + this.endTimeCombo.getValue();
	}

});