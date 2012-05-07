Ext.namespace('Portal.details');

Portal.details.AnimationPanel = Ext.extend(Ext.Panel, {
    title: 'Date Animate',
    id: 'animationPanel',
    plain: true,
    stateful: false,
    autoScroll: true,
    bodyCls: 'floatingDetailsPanel',
    style: {margin: 5},
    height: 400,

    initComponent: function(){
    	this.animatedLayers = new Array();

        this.noAnimationLabel = new Ext.form.Label({
        	hidden: true,
        	text: "This layer cannot be animated"
        });

        this.curAnimationLabel = new Ext.form.Label({
        	hidden: true,
        	text: "Currently animating"
        });

		this.speedUp = new Ext.Button({
         	icon: 'images/animation/last.png',
         	listeners: {
				scope: this,
				'click': function(button,event){
					this.resetTimer(this.speed / 2);
				}
			},
			tooltip: "Doubles animation speed"
		});

		this.slowDown = new Ext.Button({
         	icon: 'images/animation/first.png',
         	listeners: {
				scope: this,
				'click': function(button,event){
					this.resetTimer(this.speed * 2);
				}
			},
			tooltip: "Halves animation speed"
		});

		this.label = new Ext.form.Label({
			html: "<h4>Select Time Period</h4>"
		});

        this.stepSlider = new Ext.Slider({
			id: 'stepSlider',
			ref: 'stepSlider',
			width: 250,
			listeners:{
				scope: this,
				dragend: function(slider, e){
					this.setSlide(slider.getValue());
				}
			}
		});

		var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';

		var fields = [{
			name: 'index'
		},{
			name: 'displayText'
		}];

		var dateStore  = new Ext.data.ArrayStore({
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
			store: dateStore,
			valueField: 'index',
			displayField: 'displayText',
			tpl: '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>'
		});

		this.endTimeCombo = new Ext.form.ComboBox({
			id: "endTimePicker",
			fieldLabel: 'End: ',
			triggerAction: 'all',
			editable : false,
			lazyRender:true,
			mode: 'local',
			store: dateStore,
			valueField: 'index',
			displayField: 'displayText',
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

		this.stopButton = new Ext.Button({
			id: 'Stop',
			disabled: true, // readonly
			icon: 'images/animation/stop.png',
			iconAlign: 'top',
			listeners: {
				scope: this,
				'click': function(button,event){
					this.removeAnimation();
				}
			},
			tooltip: "Stops animation and remove all animated layers from map"
		});

		this.pauseButton = new Ext.Button({
			id: 'Pause',
			disabled: true, // readonly
			icon: 'images/animation/pause.png',
			iconAlign: 'top',
			listeners: {
				scope: this,
				'click': function(button,event){
					clearTimeout(this.timerId);
					this.toggleButtons(false);
				}
			},
			tooltip: "Pauses animation and can explore individual time step using the slider below"
		});

		this.stepLabel = new Ext.form.Label({
			text: "Time: "
		});

		this.buttonsPanel = new Ext.Panel({
			id: 'playerControlPanel',
			layout: 'hbox',
			items: [
				this.slowDown,
				this.playButton,
				this.stopButton,
				this.pauseButton,
				this.speedUp
			]
		});

		this.timeSelectorPanel = new Ext.Panel({
		   id: 'timeSelectorPanel',
		   layout: 'form',
		   items:[
				this.startTimeCombo,
				this.endTimeCombo,
			]
		});

        this.controlPanel = new Ext.Panel({
        	items: [
				this.timeSelectorPanel,
				this.buttonsPanel,
				this.stepLabel,
				this.stepSlider
			]
        });

        this.items = [
        	this.noAnimationLabel,
        	this.curAnimationLabel,
			this.controlPanel
        ];

        this.timerId = -1;
        this.speed = 1000;

        this.map = Ext.getCmp("map");

        Portal.details.AnimationPanel.superclass.initComponent.call(this);
    },

    toggleButtons: function(playing){
    	if(playing){
    		//can't change the time when it's playing
    		this.startTimeCombo.disable();
			this.endTimeCombo.disable();
			this.playButton.disable();

    		this.stopButton.enable();
			this.pauseButton.enable();
			this.stepSlider.enable();
    	}
        else{
        	this.startTimeCombo.enable();
			this.endTimeCombo.enable();
			this.playButton.enable();

			//nothing's playing, so stop and pause doesn't make sense
			this.stopButton.disable();
			this.pauseButton.disable();

			//no animation, so disable it
			if(this.animatedLayers.length == 0)
				this.stepSlider.disable();
        }
    },

    removeAnimation: function(){
    	if(this.animatedLayers.length > 0){
			clearTimeout(this.timerId);

			for(var i = 0; i < this.animatedLayers.length; i++){
				this.map.removeLayer(this.animatedLayers[i]);
				this.animatedLayers[i].destroy();
			}

			//stackoverflow says it's better setting length to zero than to reinitalise array.,.,.,
			this.animatedLayers.length = 0;
			this.stepLabel.setText("Time: ");
			this.stepSlider.setValue(0);
			this.stepSlider.setMaxValue(0);
			this.stepSlider.setMinValue(0);

            this.toggleButtons(false);
            this.curAnimationLabel.hide();
            this.timerId = -1;
            this.originalLayer.setVisibility(true);
		}
    },

    setSelectedLayer: function(layer){
        this.selectedLayer = layer;
    },

    setSlide: function(index){
    	if(this.animatedLayers != undefined){
    		for(var i = 0; i < this.animatedLayers.length; i++){
				this.animatedLayers[i].display(i == index);
			}

			//an animation is already happening.  Just move the slide
			//to the current index
			if(this.timerId > 0){
				this.stepSlider.setValue(index);
			}

			//also set the label
			labelStr = "Time: " + this.animatedLayers[index].params.TIME;

			if(this.animatedLayers[index].numLoadingTiles > 0)
				labelStr = labelStr + " (loading)"

			this.stepLabel.setText(labelStr);
    	}
    },

    cycleAnimation: function(){
		if(this.counter >= this.animatedLayers.length)
			this.counter = 0;
        this.setSlide(this.counter);
		this.counter++;
    },

    loadAnimation: function(){
    	if(this.startTimeCombo.getValue() == this.endTimeCombo.getValue()){
    		alert("The start and end time must not be the same");
    		return false;
    	}

    	if(this.startTimeCombo.getValue() > this.endTimeCombo.getValue()){
			alert("You must select an end date that is later than the start date");
			return false;
		}
		else{
    		if(this.animatedLayers.length == 0){
    			this.curAnimationLabel.setText("Currently animating " + this.selectedLayer.name);
    			this.curAnimationLabel.show();
    			this.originalLayer = this.selectedLayer;

    			//this will be an Map.  Key = openlayer, value = flag whether a layer has been loaded
    			this.animatedLayers = new Array();
    			this.totalSlides = 0;

    			timeDimension = this.getSelectedLayerTimeDimension();

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

						layer.isAnimated = true;

						this.animatedLayers.push(layer);

						this.map.addLayer(layer);
					}
				}
    		}

			this.selectedLayer.setVisibility(false);


			this.stepSlider.setMinValue(0);
			this.stepSlider.setMaxValue(this.animatedLayers.length - 1);
			this.resetTimer(1000);
			this.toggleButtons(true);
		}
    },

    resetTimer: function(speed){
    	this.speed = speed;
    	var inst = this;
		this.counter = 0;

		if(this.animatedLayers.length > 0){
			if(this.timerId != -1){
				clearTimeout(this.timerId);
			}

			this.timerId = setInterval(function(){
				inst.cycleAnimation();
			}, speed);

			console.log("timerId: " + this.timerId);
		}

        //else no animation is running, so can't change the speed of the animation
    },

    setupAnimationControl: function() {
        if (this.selectedLayer == undefined) {
            return false;
        }
    },

    update: function(){
    	//Just hide everything by default
		this.noAnimationLabel.hide();
		this.controlPanel.hide();

    	//if it's already animated...
    	if((this.animatedLayers != undefined) || (this.animatedLayers.length > 0)){
			if(this.selectedLayer.server.type.search("NCWMS") > -1){
				this.setLayerDatesByCapability();

				if(this.getSelectedLayerTimeDimension() != null && this.getSelectedLayerTimeDimension().extent != null){
					this.controlPanel.setVisible(true);
				}
			}
			else{
				this.noAnimationLabel.setVisible(true);
			}
		}
		else{
			this.dateStore.clear();
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
    			}
    		}

    		if(capDates.length > 0){
    			this.startTimeCombo.store.loadData(capDates);
				this.startTimeCombo.setValue(0);
				this.endTimeCombo.store.loadData(capDates);
				this.endTimeCombo.setValue(0);
    		}
    	}
    },

	setSelectedLayer: function(layer){
		this.selectedLayer = layer;
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