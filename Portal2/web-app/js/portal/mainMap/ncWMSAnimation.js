

// exchange OpenLayers.Layer.WMS with OpenLayers.Layer.Image 
// or reload OpenLayers.Layer.Image
// Reloading may be called from reloading a style or changing zoomlevel
function addNCWMSLayer(currentLayer) {
    // Wrap the Map call, this function used to live in mainMapPanel.js
	getMapPanel().addNCWMSLayer(currentLayer);
}

function setupAnimationControl() {
    
    
    if (selectedLayer == undefined) {
        console.log("animation was requested although no layer is active!!");
        return false;
    }    

     
    
    
    animatePanel.animatePanelContent.removeAll(true); 
    
    var newAnimatePanelContents = undefined;
    
    
    if (selectedLayer.dates.length == 1) {
        
        // todo animate on todays times
        newAnimatePanelContents = new Ext.Panel({
            layout: 'form',
            items: [
            new Ext.form.Label({
                html:"<p>Only one day is available - " + selectedLayer.dates[0] + "</p>"
                } )
            ]
        });
         
        animatePanel.animatePanelContent.add(newAnimatePanelContents);
        
    }
    else {
        var x = animatePanel.animatePanelContent;
        if (x.theOnlyTimePanel == undefined) {
            x.add(new Animations.TimePanel());        
        }
        else {
            // update it
            x.theOnlyTimePanel.setTimeVals(x.theOnlyTimePanel.timePanelSlider);
        //console.log("the dates are set. should reneable the start animation button");
        //Ext.getCmp('startNCAnimationButton').enable();
        }
    }
    
    
    animatePanel.animatePanelContent.doLayout();  
    

    

}
function renderAnimatePanelContents() {
     
//newAnimatePanelContents.doLayout(); 

}





Ext.namespace('Animations');
Animations.TimePanel = Ext.extend(Ext.Panel, {
    ref: 'theOnlyTimePanel',
    layout: 'form',
    initComponent: function() {
                

        this.items = [
        {
            xtype: 'label',
            html: "<h4>Select Time Period</h4>"
        },
        {
            xtype: 'slider',
            ref: 'timePanelSlider',
            width: 250,
            values: [0,selectedLayer.dates.length-1],
            minValue: 0,
            maxValue: selectedLayer.dates.length-1,
            plugins:  new Ext.ux.SliderTip({
                getText: function(slider){  
                    var thumbName = "Start";
                    if (slider.index != 0) {
                        thumbName = "End";
                    }
                    return String.format('<b>{0}:</b> {1}', thumbName,  selectedLayer.dates[slider.value].date);
                }
            })
            ,
            listeners: {
                scope: this,
                changecomplete: function(slider,val,thumb) { 
                                                              
                                
                    // which ever thumb was moved, update the selectedLayer                                                              
                    this.setTimeVals(slider);  
                    //console.log(thumb.value);
                    //console.log(selectedLayer.dates[thumb.value].date);
                    mergeNewTime(selectedLayer.dates[thumb.value].date);  
                                
                                
                },
                afterrender: function(slider) {  
                    this.setTimeVals(this.timePanelSlider);
                }
            }
        },
        {                  
            xtype: 'textfield',      
            ref: 'timeMax',
            fieldLabel: "End ",
            disabled: true, // readonly
            grow: true,
            labelStyle: "width:50px",        
            ctCls: 'smallIndentInputBox'
        },
        {
            xtype: 'textfield',
            ref: 'timeMin',
            fieldLabel: "Start ",
            disabled: true, // readonly
            grow: true,
            labelStyle: "width:50px",
            ctCls: 'smallIndentInputBox'
        },
        {
            xtype: 'textfield',
            ref: 'frameCount',
            fieldLabel: "Days",
            disabled: true, // readonly            
            grow: true,
            text: selectedLayer.dates.length,
            labelStyle: "width:50px",
            //labelStyle: "",        
            ctCls: 'smallIndentInputBox'
        },
        {
            xtype: 'button',
            id: 'startNCAnimationButton',
            text:'Start',
            disabled: true, // readonly
            //hidden: true,
            handler: function(button,event) {
                getTimePeriod();
            }
        }
                    
        ]
        Animations.TimePanel.superclass.initComponent.apply(this, arguments);
                
    },
    listeners: {
        afterrender: function(whateva) {
                    
            // do this only once for each layer
            // selectedLayer.metadata.datesWithData will already be defined at this point
            if (selectedLayer.dates == undefined) {
                setLayerDates(selectedLayer); // pass in the layer as there are going to be many async Json requests
                // disable the 'Start' button as we need all the available dates to be loaded first
                Ext.getCmp('startNCAnimationButton').disable();
            }
            else {
                // after a successful animation the 'Start' button is disabled
                // the dates have been set previously for this layer so enable the button
                Ext.getCmp('startNCAnimationButton').enable();
            }
                    
        }
    },
            
    setTimeVals: function(slider) {
                
        var dates = selectedLayer.dates;
        this.timeMin.setValue(dates[slider.getValues()[0]].date);
                
        if (slider.getValues()[1] != undefined) {
            this.timeMax.setValue(dates[slider.getValues()[1]].date);
            this.frameCount.setValue(slider.getValues()[1] -  slider.getValues()[0] + 1); // + item at zero
        }
        else {
            this.timeMax.setValue(undefined);
            this.frameCount.setValue(undefined);
        }
                
    }
            
            
      
}); 
Ext.reg('animations.timePanel', Animations.TimePanel);


// merge time = YYYY-MM-DDTblaghblagh for getMap requests
// some servers require the date and time rather than day
function mergeNewTime(day) {     
    
    
    for(var i=0; i<selectedLayer.dates.length; i++) {
        if (selectedLayer.dates[i].date == day) {
            
            var lastTime = selectedLayer.dates[i].dateTimes[selectedLayer.dates[i].dateTimes.length -1];
            selectedLayer.mergeNewParams({
                time : lastTime
            });
        } 
    }
    
   
}
       
// set all the date/times for the layer
// creates an array (dates) of objects {date,datetimes} for a layer
function setLayerDates(layer){ 

    
    // add this new attribute to the layer
    layer.dates = []; 
    
    var datesWithData = layer.metadata.datesWithData; 
    //var selectedDate = selectedLayer.nearestTime;
    
    
    var dayCounter = 0; // count of how many days
    
    for (var year in datesWithData) {
        for (var month in datesWithData[year]) {            
            for (var day in datesWithData[year][month]) {
                // add 1 to the month and number as datesWithData uses a zero-based months
                // take the value at the index day if its a number
                if (!isNaN(parseInt(datesWithData[year][month][day]))) {
                    
                    var newDay = year + "-" + pad(parseInt(month)+1, 2 ) +"-" + pad(datesWithData[year][month][day], 2);                    
                    layer.dates.push({
                        date: newDay
                    });                    
                    // start off a Ajax request to add the dateTimes for this date
                    setDatetimesForDate(layer, newDay);
                    dayCounter ++;
                }
            }
        }        
    }
    // store with the layer.
    // set to undefined when setDatetimesForDate returns a result for every day
    layer.dayCounter = dayCounter;
    
}


function setDatetimesForDate(layer, day) {
    
    var url;
    // see if this layer is flagged a 'cached' layer. a Cached layer is allready requested through our proxy
    //console.log(layer);
    if (layer.cache === true) {
       url = layer.server.uri;
       url = proxyCachedURL + encodeURIComponent(layer.server.uri) +  "?request=GetMetadata&item=timesteps&layerName=" +  layer.params.LAYERS +   "&day=" + day;
    }
    else {
       url = layer.url;
       url = proxyURL+encodeURIComponent(url +  "?request=GetMetadata&item=timesteps&layerName=" +  layer.params.LAYERS +   "&day=" + day);
    }
        
    // getMetadata gave us the days but not the times of the day
    Ext.Ajax.request({        
        
        
        url: url,
        success: function(resp) { 
            
            var res = Ext.util.JSON.decode(resp.responseText);
            var dateTimes = [];
            
            for(var i=0; i<res.timesteps.length; i++) {            
                dateTimes.push(day +  "T" + res.timesteps[i]);          
            }  
            // store the datetimes for each day
            for(var i=0; i<layer.dates.length; i++) {
                if (layer.dates[i].date == day) {
                    layer.dates[i].dateTimes = dateTimes;
                } 
            }
            
            layer.dayCounter--;
            //console.log(layer.dayCounter);
            
            // set to undef when setDatetimesForDate returns a result for every day
            // now we are safe to allow animation
            if (layer.dayCounter == 0) {
                layer.dayCounter = undefined;
                // a user may now try and pick a date to animate  
                animatePanel.setDisabled(false);
                // The 'Start' button can be shown, but it may not be rendered yet
                // try to enable in the render listener as well
                // then animation can then procede
                if (Ext.getCmp('startNCAnimationButton') != undefined) {
                    Ext.getCmp('startNCAnimationButton').enable();
                }
            }
            
        }
    });
}

// use to get the allready stored dateTimes for date
// for the selectedLayer
function getDateTimesForDate(day) {
    var dateTimes = [];
    for(var i=0; i<selectedLayer.dates.length; i++) {
        if (selectedLayer.dates[i].date == day) {
            // console.log(selectedLayer.dates[i]);
            dateTimes = selectedLayer.dates[i].dateTimes;
        } 
    }
    return dateTimes;
    
}



function getTimePeriod() {
    
    // disable the 'Start' button for the next possible layer
    Ext.getCmp('startNCAnimationButton').disable();
    
    if (animatePanel.animatePanelContent.theOnlyTimePanel != undefined) {
        //var maxFrames = 8;
        var chosenTimes = [];
        
        var url;
        // see if this layer is flagged a 'cached' layer. a Cached layer is already requested through our proxy
        //console.log(layer);
        if (selectedLayer.cache === true) {
           url = selectedLayer.server.uri;
        }
        else {
           url = selectedLayer.url;
        }
        
        var p = animatePanel.animatePanelContent.theOnlyTimePanel; 
        //alert(p);
        // get the server to tell us the options
        Ext.Ajax.request({
            url: proxyURL+encodeURIComponent(url + 
                "?request=GetMetadata&item=animationTimesteps&layerName=" + 
                selectedLayer.params.LAYERS + 
                "&start=" + getDateTimesForDate(p.timeMin.value)[0] +
                "&end=" + getDateTimesForDate(p.timeMax.value)[0]
            ),
            success: function(resp) { 

                var res = Ext.util.JSON.decode(resp.responseText);
                    
                if (res.timeStrings != undefined) {
                    // popup a window
                    showTimestepPicker(res.timeStrings);
                }
            }
        });
    }  
}

// modal timestep picker for animating current layer
function showTimestepPicker(timeStrings) {
    
    // copy to the attributes needed by the Ext radioGroup
    for (vars in timeStrings) {
        timeStrings[vars].boxLabel = timeStrings[vars].title
        timeStrings[vars].name = "justaname"//,
    //timeStrings[vars].inputValue = timeStrings[vars].timeString
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
                change: function( field, newValue, oldValue, eOpts ) {          
                	Ext.getCmp('timestepWindow').destroy(); // this components parent window
                    createNCWMSLayerFromTimesteps(newValue.initialConfig.timeString);
                }
            }
        }
        /*,
            {
                xtype: 'button',
                id: 'animateNowButton',
                style: {
                    padding: '10px'
                },
                text:'Animate',
                //disabled: true, // readonly
                handler: function(button,event) {
                    
                   animateTimePeriod(selectedLayer);
                }
            }
            */
        ]
    });
    
    timestepWindow.show();
    
}


function createNCWMSLayerFromTimesteps(timeSteps) {              
        
        
    //chosenTimes.push(getDateTimesForDate(p.timeMin.value)[0]); 
    //chosenTimes.push(getDateTimesForDate(p.timeMax.value)[0]); 
    // get all the times between user selected range
    //var dates = setAnimationTimesteps(params);   
        
    selectedLayer.chosenTimes = timeSteps;         
    addNCWMSLayer(selectedLayer);
}



