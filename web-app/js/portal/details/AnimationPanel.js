Ext.namespace('Portal.details');

Portal.details.AnimationPanel = Ext.extend(Ext.Panel, {

	state : {
		LOADING : "LOADING",
		PLAYING : "PLAYING",
		STOPPED : "STOPPED"
	},

	constructor : function(cfg) {
		var config = Ext.apply({
					layout : 'form',
					stateful : false,
					bodyStyle : 'padding:6px; margin:2px',
					defaults : {
						cls : 'fullTransparency'
					},
					width : '100%'
				}, cfg);

		Portal.details.AnimationPanel.superclass.constructor.call(this, config);
	},

	initComponent : function() {
		this.DATE_FORMAT = 'Y-m-d';
		this.TIME_FORMAT = 'H:i:s (P)';
		this.DATE_TIME_FORMAT = this.DATE_FORMAT + ' ' + this.TIME_FORMAT;
		this.STEP_LABEL_DATE_TIME_FORMAT = this.DATE_FORMAT + " H:i:s";

		this.BASE_SPEED = 500;
		this.MAX_SPEED_MULTIPLIER = 32;

		this.animatedLayers = new Array();
		var parent = this;

		this.warn = new Ext.form.Label({
					padding : 5,
					width : 280,
					text : OpenLayers.i18n('warn_label')
				});

		this.speedUp = new Ext.Button({
					icon : 'images/animation/last.png',
					plain : true,
					padding : 5,
					listeners : {
						scope : this,
						'click' : function(button, event) {
							this._resetTimer(this.speed / 2);
						}
					},
					tooltip : OpenLayers.i18n('speedUp')
				});

		this.slowDown = new Ext.Button({
					icon : 'images/animation/first.png',
					padding : 5,
					listeners : {
						scope : this,
						'click' : function(button, event) {
							this._resetTimer(this.speed * 2);
						}
					},
					tooltip : OpenLayers.i18n('slowDown')
				});

		this.label = new Ext.form.Label({
					html : "<h4>Select Time Period</h4>"
				});

		this.stepSlider = new Ext.slider.SingleSlider({
					ref : 'stepSlider',
					width : 115,
					flex : 3,
					listeners : {
						scope : this,
						drag : function(slider, ev) {
							this._setSlide(slider.getValue());
						}
					}
				});

		this.playButton = new Ext.Button({
					padding : 5,
					plain : true,
					disabled : false, // readonly
					icon : 'images/animation/play.png',
					listeners : {
						scope : this,
						'click' : this._togglePlay
					},
					tooltip : OpenLayers.i18n('play')
				});

		this.currentState = this.state.STOPPED;

		this.stepLabel = new Ext.form.Label({
					flex : 1,
					width : 115,
					style : 'padding-top: 5; padding-bottom: 5'
				});

		this.speedLabel = new Ext.form.Label({
					flex : 1,
					style : 'padding: 5'
				});

		this.buttonsPanel = new Ext.Panel({
					layout : 'hbox',
					plain : true,
					items : [this.slowDown, this.playButton, this.speedUp],
					height : 40,
					flex : 2
				});

		this.startLabel = new Ext.form.Label({
					html : "Start:"
				});

		this.endLabel = new Ext.form.Label({
					html : "End: ",
					width : 70
				});

		this.startDatePicker = new Ext.form.DateField({
					format : 'd-m-Y',
					editable : false,
					width : 100,
					listeners : {
						scope : this,
						select : this._onDateSelected
					}

				});

		this.endDatePicker = new Ext.form.DateField({
					format : 'd-m-Y',
					editable : false,
					width : 100,
					listeners : {
						scope : this,
						select : this._onDateSelected
					}
				});

		this.startTimeCombo = new Ext.form.ComboBox(Ext.apply({
					listeners : {
						scope : this,
						select : function(combo, record, index) {
							var timeStr = this._getSelectedTimeString(true);
//							this.selectedLayer.mergeNewParams({
//										TIME : timeStr
//									});
							this._setTimeAsStepLabelText(timeStr);
						}
					}
				}, this._timeComboOptions()));
		this.endTimeCombo = new Ext.form.ComboBox(this._timeComboOptions());

		this.timeSelectorPanel = new Ext.Panel({
					layout : 'table',
					layoutConfig : {
						tableAttrs : {
							style : {
								width : '80%'
							}
						},
						columns : 3
					},
					width : 350,
					plain : true,
					items : [this.startLabel, this.startDatePicker,
							this.startTimeCombo, this.endLabel,
							this.endDatePicker, this.endTimeCombo]
				});

		this.getAnimationButton = new Ext.Button({
			icon : 'images/animation/download.png',
			text : 'download',
			hidden : true,
			listeners : {
				scope : this,
				click : function() {
					if (this.originalLayer.slides.length > 0) {
						// need to workout BBOX
						var clonedLayer = this.originalLayer.slides[0].clone();
						var bounds = this.originalLayer.map.getExtent();

						clonedLayer.mergeNewParams({
							TIME : this.originalLayer.slides[0].params.TIME
									+ "/"
									+ this.originalLayer.slides[this.originalLayer.slides.length
											- 1].params.TIME,
							BBOX : bounds.toBBOX(),
							FORMAT : "image/gif", // must be gif!!
							WIDTH : 512,
							HEIGHT : Math.floor(512
									* (bounds.getHeight() / bounds.getWidth()))
						});

						clonedLayer.map = this.originalLayer.map;

						var fullUrl = "proxy/downloadGif?url="
								+ clonedLayer.getFullRequestString();
						window
								.open(
										fullUrl,
										'_blank',
										"width=200,height=200,menubar=no,location=no,resizable=no,scrollbars=no,status=yes");
					}
				}
			}
		});

		this.controlPanel = new Ext.Panel({
					layout : 'form',
					plain : true,
					items : [{
						xtype : 'container',
						defaultMargins : "15 5 20 5",
						layout : {
							type : 'hbox',
							pack : 'start'

						},
						items : [this.buttonsPanel, this.stepSlider,
								this.speedLabel, this.stepLabel]
					}, this.timeSelectorPanel, this.getAnimationButton],
					width : 330,
					height : '100%'
				});

		this.items = [this.controlPanel];

		this.speed = this.BASE_SPEED;
		this._resetForNewAnimation();
		this.map = undefined;

		this.pausedTime = "";
		this.timerId = -1;

		Portal.details.AnimationPanel.superclass.initComponent.call(this);
	},

	setMap : function(theMap) {
		this.map = theMap;
		this.map.map.events.register('moveend', this, this._onMove);
	},

	_togglePlay : function(button, event) {
		if (this.currentState == this.state.PLAYING) {
			this._stopPlaying();
		} else {
			this._startPlaying();
		}
	},

	_stopPlaying : function() {
		clearTimeout(this.timerId);
		this.pausedTime = this.animatedLayers[this.counter].params["TIME"];
		this._updateButtons(this.state.STOPPED);
	},

	_startPlaying : function() {
		var dates = this._getFormDates();
		this._waitForOriginalLayer(dates[0], dates[1]);
	},

	_onDateSelected : function(field, date) {
		var combo;

		if (field === this.startDatePicker) {
			combo = this.startTimeCombo;
		} else {
			combo = this.endTimeCombo;
		}

		var key = this._toDateString(date);
		if (this.allTimes[key] != null) {
			combo.clearValue();
			combo.getStore().loadData(this.allTimes[key], false);
		}
	},

	_resetForNewAnimation : function() {
		this.timerId = -1;
		this.speed = this.BASE_SPEED;
		this.originalOpacity = -1;
		this.pausedTime = "";

		// resetting the array
		this.animatedLayers = new Array();
	},

	_updateButtons : function(state) {
		this.currentState = state;

		if (state == this.state.LOADING) {
			// can't change the time when it's loading
			this.playButton.setIcon('images/animation/pause.png');
			this.stepSlider.disable();
			this.speedUp.disable();
			this.slowDown.disable();
			this.speedLabel.setVisible(false);
			this.getAnimationButton.setVisible(false);
		} else if (state == this.state.PLAYING) {
			// can't change the time when it's playing
			this.playButton.setIcon('images/animation/pause.png');
			this.stepSlider.enable();
			this.speedLabel.setVisible(true);
			this.getAnimationButton.setVisible(true);
			this._updateSpeedButtons();
		} else if (state == this.state.STOPPED) {
			this.playButton.setIcon('images/animation/play.png');
			this.startTimeCombo.enable();
			this.endTimeCombo.enable();
			this.playButton.enable();
			// nothing's playing, so stop and pause doesn't make sense

			this.speedLabel.setVisible(false);
			this.getAnimationButton.setVisible(false);

			this._updateSpeedButtons();
		}
		// Even if playing/paused, disable speed up/down if already at
		// maxspeed/minspeed

	},

	// Grey out speed buttonss if reached max multiplier
	_updateSpeedButtons : function() {
		if (this.speed * 1000 <= this.BASE_SPEED * 1000
				/ this.MAX_SPEED_MULTIPLIER) {
			this.speedUp.disable();
		} else if (this.speed >= this.MAX_SPEED_MULTIPLIER * this.BASE_SPEED) {
			this.slowDown.disable();
		} else {
			this.slowDown.enable();
			this.speedUp.enable();
		}
	},

	_onMove : function() {
		// Openlayers.Map seems to reset display of layers after a move
		// so rereset it back.
		if(this.originalLayer != null && this.originalLayer.getVisibility())
		{
			for (var i = 0; i < this.animatedLayers.length; i++) {
				var value = i == this.counter
				this.animatedLayers[i].display(value);
				this.animatedLayers[i].redraw();
			}
		}
	},

	removeAnimation : function() {
		if (this.animatedLayers.length > 0) {
			clearTimeout(this.timerId);

			if (this.map == null) {
				this.map = Ext.getCmp("map");
			}

			this.originalLayer.name = this.originalLayer.name.substr(0,
					this.originalLayer.name.indexOf(" (animated)"));
			this.originalLayer.setOpacity(this.originalOpacity);

			while (this.animatedLayers.length > 0) {
				if ((this.animatedLayers[0].map == null)) {
					this.animatedLayers[0] = null;
				} else {
					this.map.map.removeLayer(this.animatedLayers[0],
							this.originalLayer);
				}

				this.animatedLayers.shift();
			}

			// stackoverflow says it's better setting length to zero than to
			// reinitalise array.,.,.,
			this.animatedLayers.length = 0;
			this._setStepLabelText("");

			this._updateButtons(this.state.STOPPED);

			this._resetForNewAnimation();
			delete this.originalLayer.isAnimated;
		}

	},

	setSelectedLayer : function(layer) {
		this.selectedLayer = layer;
	},

	_setSlide : function(index) {
		if (this.animatedLayers.length > 0) {
			for (var i = 0; i < this.animatedLayers.length; i++) {
				this.animatedLayers[i].display(i == index);
			}

			// this should still work even if there's no animation, i.e. paused
			this.stepSlider.setValue(index);

			// also set the label
			var labelStr = this.animatedLayers[index].params.TIME;

			this
					._setTimeAsStepLabelText(this.animatedLayers[index].params.TIME);

			if (this._isLoadingAnimation()) {
				this._setStepLabelText("Loading... "
						+ Math.round((index + 1) / this.animatedLayers.length
								* 100) + "%");
			}
		}
	},

	_cycleAnimation : function(forced) {
		if (this.originalLayer.getVisibility()) {
			if (this.counter < this.animatedLayers.length - 1) {
				var curLayer = this.animatedLayers[this.counter + 1];
				if (this.map.map.getLayer(curLayer.id) == null) {
					this.map.map.addLayer(curLayer, false);
					this.map.map.setLayerIndex(curLayer, this.map.map
									.getLayerIndex(this.originalLayer));
					curLayer.display(false);
				} else {
					if (curLayer.numLoadingTiles == 0) {
						this.counter++;
						this._setSlide(this.counter);
					}
				}
			} else {
				this.counter = 0;
				this._setSlide(this.counter);
			}
		}

	},

	_makeNextSlide : function(timeStamp) {
		var newLayer = this.originalLayer.template.clone();

		if (this.originalLayer.name.indexOf("animated") > 0) {
			newLayer.name = this.originalLayer.name.substr(0,
					this.originalLayer.name.indexOf(" (animated)"))
					+ " (" + timeStamp + ")";
		} else {
			newLayer.name = this.originalLayer.name + " (" + timeStamp + ")";
		}
		newLayer.mergeNewParams({
					TIME : timeStamp
				});

		newLayer.setVisibility(true);
		// newLayer.setOpacity(1);
		// TODO: This assumes the slide we're making should be displayed
		// straight away
		newLayer.display(false);
		newLayer.isAnimatedSlice = true; // NOTE: isAnimatedSlice = a layer
		// that is part of the animation,
		// whereas
		// isAnimated denotes the ORIGINAL layer that is currently animated.

		return newLayer;
	},

	_getFormDates : function() {
		if (this.startDatePicker.getValue() === ""
				|| this.endDatePicker.getValue() === ""
				|| this.startTimeCombo.getValue() === ""
				|| this.endTimeCombo.getValue() === "") {
			// Incomplete start/end time! Do nothing.
			// Maybe show a message
			return;
		}

		var startString = this._getSelectedTimeString(true);
		var endString = this._getSelectedTimeString(false);
		return [startString, endString];
	},

	/*
	 * This function waits for the original layer to load first before creating
	 * time slices.
	 * 
	 * If the original layer hasn't completely loaded, the time slices (since
	 * they are cloned!) will try and attempt to load the missing tiles from the
	 * original layer too. Which means, the time slices never loads and the
	 * animation doesn't start.
	 */
	_waitForOriginalLayer : function(startString, endString) {
		if (this.selectedLayer.numLoadingTiles > 0) {

			this._updateButtons(this.state.LOADING);
			this.selectedLayer.events.register('loadend', this, function() {
						this._loadAnimation(startString, endString);
					});
		} else {
			this._loadAnimation(startString, endString)
		}
	},

	_loadAnimation : function(startString, endString) {
		var startDate = this._parseIso8601Date(startString);
		var endDate = this._parseIso8601Date(endString);
		


		if (startDate == endDate) {
			alert("The start and end time must not be the same");
			return false;
		}

		if (startDate.getTime() > endDate.getTime()) {
			alert("You must select an end date that is later than the start date");
			return false;
		} else {
			this.originalLayer = this.selectedLayer;

			if (this.originalOpacity == -1)
				this.originalOpacity = this.selectedLayer.opacity;

			this.originalLayer.isAnimated = true;
			if (this.originalLayer.name.indexOf("animated") < 0) {
				this.originalLayer.setName(this.originalLayer.name
						+ " (animated)");

				// setup originalLayer as an animated layer adding and
				// overriding methods and parameters

				// NOTE: isAnimatedSlice = a layer that is part of the
				// animation, whereas
				// isAnimated denotes the ORIGINAL layer that is currently
				// animated.

				// this.map.map.events.triggerEvent("changelayer", {
				// layer: this.originalLayer, property: "name"
				// });

				// can't clone later, or the sublayers will pick up the extra
				// stuff we're about to add
				this.originalLayer.template = this.originalLayer.clone();

				for (var i = 0, len = this.originalLayer.div.childNodes.length; i < len; ++i) {
					var element = this.originalLayer.div.childNodes[i].firstChild;
					OpenLayers.Util.modifyDOMElement(element, null, null, null,
							null, null, null, 0);
				}

				this.originalLayer.slides = new Array();

				this.originalLayer.addSlide = function(openlayer) {
					this.slides.push(openlayer);										

				}
				// might be better to go other way round, ie sublayers retrieve
				// opacity from their parent, but think some things access
				// opacity directly rather than through get method
				this.originalLayer.setOpacity = function(opacity) {
					this.opacity = opacity;
					for (var i = 0; i < this.slides.length; i++) {
						this.slides[i].setOpacity(opacity);
					}
				}

				this.originalLayer.mergeNewParams = function(newParams) {
					//TODO:things will go very wrong if fed a TIME param here...
					for (var i = 0; i < this.slides.length; i++) {
						this.slides[i].mergeNewParams(newParams);
					}
					return OpenLayers.Layer.WMS.prototype.mergeNewParams.apply(
							this, newParams);
				}

				this.originalLayer.display = function(value) {
					if (!value) {
						for (var i = 0; i < this.slides.length; i++) {
							this.slides[i].display(false);
						}
					}
				}
				this.originalLayer.setVisibility = function(value) {
					this.visibility = value;
					if (!value) {
						for (var i = 0; i < this.slides.length; i++) {
							this.slides[i].setVisibility(false);
						}
					} else {
						// if visibility is off then won't update on zoom
						for (var i = 0; i < this.slides.length; i++) {
							this.slides[i].setVisibility(true);
							this.slides[i].display(false);
						}
					}
					this.display(false);
					this.events.triggerEvent("visibilitychanged");
				}

				this.originalLayer._onChangeLayer = function(evt) 
				{
					// if this layer's order(bottom,second from top, etc) is changed, change the order
					// of the frames aswell. 
				
					

					if (evt.property == "order") 
					{
						for (var i = 0; i < this.slides.length; i++) 
						{
							if(this.slides[i]==evt.layer)
							{
								return;
							}
						}

						for (var i = 0; i < this.slides.length; i++) 
						{
							//Weird stuf happens here, but it works.
							//just moving the slides doesn't register in the active layers panel
							//So remove and add...
							this.map.removeLayer(this.slides[i]);
							this.map.addLayer(this.slides[i])
//							console.log("Moving " + this.slides[i] + "to index " + this.map.getLayerIndex(this));
							this.map.setLayerIndex(this.slides[i], this.map.getLayerIndex(this)+1);
						}
					}
				}
				
				this.originalLayer._onLayerRemoved = function(evt) 
				{
					if (evt.layer == this)
					{
						console.log("removing layer with"+ this.slides.length +"slides");
						for (var i = 0; i < this.slides.length; i++) 
						{
							this.slides[i].map.removeLayer(this.slides[i]);
						}
					}
				}
				
				this.originalLayer._onLayerAdded = function(evt) 
				{
					if (evt.layer == this)
					{
						console.log("Adding layer with"+ this.slides.length +"slides");
						for (var i = 0; i < this.slides.length; i++) 
						{
							this.map.addLayer(this.slides[i]);
						}
						for (var i = 0; i < this.map.layers.length; i++) 
						{
						 console.log("Layer "+this.map.layers[i].name +"is " +i );
						}
					}
				}

				this.originalLayer.events.on({
							"visibilitychanged" : this._onLayerVisibilityChanged,
							scope : this
						});

				this.map.map.events.on({
							"removelayer" : this.originalLayer._onLayerRemoved,
							scope : this.originalLayer
						});

				this.map.map.events.on({
							"addlayer" : this.originalLayer._onLayerAdded,
							scope : this.originalLayer
						});
						
				this.map.map.events.on({
							"changelayer" : this.originalLayer._onChangeLayer,
							scope : this.originalLayer
						});
			}

			var startIndex;
			var endIndex;
			var dimSplit = this.getSelectedLayerTimeDimension().extent
					.split(",");

			for (var i = 0; !(startIndex && endIndex) && i < dimSplit.length; i++) {
				var date = this._parseIso8601Date(dimSplit[i]);
				// Use >= because some strings have milliseconds on them meaning
				// getting exact equality could be impossible
				if (date.getTime() >= startDate.getTime() && !startIndex) {
					startIndex = i;
				} else if (date.getTime() >= endDate.getTime() && !endIndex) {
					endIndex = i;
				}
			}

			this.originalLayer.chosenTimes = dimSplit[startIndex] + "/"
					+ dimSplit[endIndex];

			var newAnimatedLayers = new Array();
			
			// provide instant feedback that we're trying to load stuff
			this._setStepLabelText("Loading... 0%");
			
			for (var j = startIndex; j <= endIndex; j++) {
				var newLayer = null;

				// find existing layer
				if (this.originalLayer.slides.length > 0) {
					for (var i = 0; i < this.originalLayer.slides.length; i++) {
						if (dimSplit[j] === this.originalLayer.slides[i].params["TIME"]) {
							newLayer = this.originalLayer.slides[i];
						}
					}
				}

				// or create new layer, since it hasn't been animated before
				if (newLayer == null) {

					
					newLayer = this._makeNextSlide(dimSplit[j]);
					newLayer.parentLayer = this;
				}
				newAnimatedLayers.push(newLayer);
			}

			this.animatedLayers = newAnimatedLayers;
			
			this.originalLayer.slides.length = 0;
			for (var i = 0; i < newAnimatedLayers.length; i++) {
				this.originalLayer.slides.push(newAnimatedLayers[i]);
			}
			
						
			// always pre-load the first one
			this.map.map.addLayer(this.originalLayer.slides[0], false);
			this.map.map.setLayerIndex(this.originalLayer.slides[0], this.map.map
							.getLayerIndex(this.originalLayer));

			// this.selectedLayer.setOpacity(1);
			this.stepSlider.setMinValue(0);
			this.stepSlider.setMaxValue(this.originalLayer.slides.length - 1);

			if (this.pausedTime !== "") {
				this.counter = this._getIndexFromTime(this.pausedTime);
			} else {
				this.counter = 0;
			}

			this._resetTimer(this.speed);
			this._updateButtons(this.state.PLAYING);
		}
	},

	_onLayerVisibilityChanged : function() {
		if (!this.originalLayer.getVisibility()) {
			this._stopPlaying();
		} else {
			this.originalLayer.slides[this.stepSlider.getValue()].display(true);
		}
	},

	_onLayerRemoved : function(evt) {
		console.log("Layer removed");
		
		while (this.animatedLayers.length > 0) {
			if ((this.animatedLayers[0].map == null)) {
				this.animatedLayers[0] = null;
			} else {
				this.map.map.removeLayer(this.animatedLayers[0],
						this.originalLayer);
			}

			this.animatedLayers.shift();
		}
//		if (evt.layer == this.originalLayer)
//			this.removeAnimation();
	},

	_resetTimer : function(speed) {
		this.speed = speed;
		var inst = this;

		if (this.animatedLayers.length > 0) {
			if (this.timerId != -1) {
				clearTimeout(this.timerId);
			}

			this.timerId = setInterval(function() {
						inst._cycleAnimation();
					}, speed);

		}

		// more milliseconds between each step, so it's slower!
		if (this.speed > this.BASE_SPEED)
			this.speedLabel.setText(" (x1/" + (this.speed / this.BASE_SPEED)
							+ ")", false);
		else
			this.speedLabel.setText(" (x " + (this.BASE_SPEED / this.speed)
							+ ")", false);

		this._updateSpeedButtons();
		// else no animation is running, so can't change the speed of the
		// animation
	},

	update : function() {
		this.controlPanel.hide();

		if (this.getSelectedLayerTimeDimension() != null
				&& this.getSelectedLayerTimeDimension().extent != null) {
			// There's a animation already configured (paused, or playing)
			if (this.animatedLayers.length == 0) {
				// no animation has been set yet, so configure the panel
				this._setLayerDatesByCapability();
				this.controlPanel.setVisible(true);
			} else if (this.selectedLayer.id == this.originalLayer.id) {
				this.controlPanel.setVisible(true);
			}
		} else {
			// No time dimension, it's a dud!
			// hide.call(target, this);
		}
	},

	_setDateRange : function(picker, startDate, endDate) {
		picker.setMinValue(startDate);
		picker.setMaxValue(endDate);
		picker.setValue(startDate);
	},

	_extractDays : function(dim) {
		var splitDates = dim.extent.split(",");
		if (splitDates.length > 0) {
			var startDate = this._parseIso8601Date(splitDates[0]);
			var endDate = this._parseIso8601Date(splitDates.last());
			
					

			// set the start/end date range for both pickers
			this._setDateRange(this.startDatePicker, startDate, endDate);
			this._setDateRange(this.endDatePicker, startDate, endDate);

			this._setDayTimes(splitDates);
			this._setMissingDays(splitDates);

			var defaultStart = this._getTimeComboStartDate(splitDates);
			//endDate gets stuffed up by the picker when we setDateRange, hence redoing the retrieval
			var defaultEnd = this._parseIso8601Date(splitDates.last());
			
			this._setTime(this.startDatePicker, this.startTimeCombo, defaultStart);
			this._setTime(this.endDatePicker, this.endTimeCombo, defaultEnd);
		}
	},

	_setDayTimes : function(dateStringsArray) {
		this.allTimes = {};

		for (var j = 0; j < dateStringsArray.length; j++) {
			var date = Date.parseDate(dateStringsArray[j], "c");
			var dayString = this._toDateString(date);
			var timeString = this._toTimeString(date);
			var timeRoundedString = this._toTimeString(this
					._roundToNearestFiveMinutes(date));

			if (this.allTimes[dayString] == null) {
				this.allTimes[dayString] = new Array();
			}
			this.allTimes[dayString].push([timeString, timeRoundedString]);
			
//			if(j==0)
//			{
//				console.log(timeString);
//				console.log(date.toString());
//			}
		}
		
	},

	_setMissingDays : function(dateStringsArray) {
		if (!this.allTimes) {
			this._setDayTimes(dateStringsArray);
		}

		var missingDays = [];
		var curDate = this._parseIso8601Date(dateStringsArray[0]);
		var endDate = this._parseIso8601Date(dateStringsArray.last());
		while (curDate < endDate) {
			var day = this._toDateString(curDate);
			if (this.allTimes[day] == null) {
				missingDays.push(day);
			}
			curDate.setDate(curDate.getDate() + 1);
		}

		if (missingDays.length > 1) {
			this.startDatePicker.setDisabledDates(missingDays);
			this.endDatePicker.setDisabledDates(missingDays);
		}
	},

	_setLayerDatesByCapability : function() {
		var dim = this.getSelectedLayerTimeDimension();
		if (dim != null) {
			this._extractDays(dim);
			// TODO: set default to last 10 timestamp for instant animation
		}

	},

	getSelectedLayerTimeDimension : function() {
		if ((this.selectedLayer != undefined)
				&& (this.selectedLayer.dimensions != undefined)) {
			for (var i = 0; i < this.selectedLayer.dimensions.length; i++) {
				if (this.selectedLayer.dimensions[i].name == "time") {
					return this.selectedLayer.dimensions[i];
				}
			}
		}
		return null;
	},

	_isLoadingAnimation : function() {
		if (this.animatedLayers.length > 0) {
			for (var i = 0; i < this.animatedLayers.length; i++) {
				if (this.map.map.getLayer(this.animatedLayers[i].id) == null)
					return true;
				if (this.animatedLayers[i].numLoadingTiles > 0) {
					return true;
				}
			}
		}

		return false;
	},

	_getIndexFromTime : function(timeStr) {
		if (this.animatedLayers.length > 0) {
			for (var i = 0; i < this.animatedLayers.length; i++) {
				if (this.animatedLayers[i].params["TIME"] === timeStr)
					return i;
			}
		}

		return -1;
	},

	isAnimating : function() {
		return (this.animatedLayers.length > 0);
	},

	_setTime : function(picker, combo, timestamp) {
		picker.setValue(timestamp);
		this._onDateSelected(picker, timestamp);
		combo.setValue(timestamp.format(this.TIME_FORMAT));

	},

	_getSelectedTimeString : function(isStart) {
		if (isStart) {
			return this._toUtcIso8601DateString(
					this.startDatePicker.getValue(), this.startTimeCombo
							.getValue());
		}
		return this._toUtcIso8601DateString(this.endDatePicker.getValue(),
				this.endTimeCombo.getValue());
	},

	loadFromSavedMap : function(layer, stamps) {
		this.setSelectedLayer(layer);
		this.update();
		this._waitForOriginalLayer(stamps[0], stamps[1]);
	},

	_parseIso8601Date : function(string) {
		return Date.parseDate(string, "c");
	},

	_toDateString : function(date) {
		return date.format(this.DATE_FORMAT);
	},

	_toUtcDateString : function(date) {
		return date.getUTCFullYear() + "-"
				+ this._pad((date.getUTCMonth() + 1)) + "-"
				+ this._pad(date.getUTCDate());
	},

	_toTimeString : function(date) {
		return date.format(this.TIME_FORMAT);
	},

	_toUtcTimeString : function(date) {
		return this._pad(date.getUTCHours()) + ":"
				+ this._pad(date.getUTCMinutes()) + ":"
				+ this._pad(date.getUTCSeconds()) + 'Z';
	},

	_pad : function(val) {
		return val < 10 ? '0' + val : val.toString();
	},

	_getTimeComboStartDate : function(dates) {
		return this
				._parseIso8601Date(dates[this._getTimeComboStartIndex(dates)]);
	},

	_getTimeComboStartIndex : function(dates) {
		return dates.length > 10 ? dates.length - 10 : 0;
	},

	_toUtcIso8601DateString : function(date, timeString) {
		if (timeString) {
			return this._toUtcIso8601DateString(Date.parseDate(date
							.format(this.DATE_FORMAT)
							+ ' ' + timeString, this.DATE_TIME_FORMAT));
		}
		return this._toUtcDateString(date) + 'T' + this._toUtcTimeString(date);
	},

	_setStepLabelText : function(text) {
		this.stepLabel.setText(text, false);
	},

	_setTimeAsStepLabelText : function(dateTimeString) {
		this._setStepLabelText(this._parseIso8601Date(dateTimeString)
				.format(this.STEP_LABEL_DATE_TIME_FORMAT));
	},

	_roundToNearestFiveMinutes : function(date) {
		var roundedDate = new Date(date.getTime());
		if (roundedDate.getMinutes() > 57) {
			roundedDate.setHours(roundedDate.getHours() + 1);
		}
		roundedDate.setMinutes((Math.round(roundedDate.getMinutes() / 5) * 5)
				% 60);
		roundedDate.setSeconds(0);
		return roundedDate;
	},

	_timeComboStoreOptions : function() {
		return {
			autoLoad : false,
			autoDestroy : true,
			fields : ['time', 'roundedTime'],
			data : []
		};
	},

	_timeComboOptions : function() {
		return {
			store : new Ext.data.ArrayStore(this._timeComboStoreOptions()),
			mode : 'local',
			triggerAction : "all",
			editable : false,
			valueField : 'time',
			displayField : 'roundedTime',
			width : 110
		};
	}

});