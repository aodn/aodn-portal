

function setupAnimationControl() {
    
    
    if (selectedActiveLayer == undefined) {
        console.log("animation was requested although no layer is active!!");
        return false;
    }    

     
    
    
    animatePanel.animatePanelContent.removeAll(true); 
    
    var newAnimatePanelContents = undefined;
    
    
    if (selectedActiveLayer.dates.length == 1) {
        
        // todo animate on todays times
        newAnimatePanelContents = new Ext.Panel({
            layout: 'form',
            items: [
                new Ext.form.Label({html:"<p>Only one day is available - " + selectedActiveLayer.dates[0] + "</p>"} )
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
                        values: [0,selectedActiveLayer.dates.length-1],
                        minValue: 0,
                        maxValue: selectedActiveLayer.dates.length-1,
                        plugins:  new Ext.ux.SliderTip({
                                getText: function(slider){  
                                    var thumbName = "Start";
                                    if (slider.index != 0) {
                                        thumbName = "End";
                                    }
                                    return String.format('<b>{0}:</b> {1}', thumbName,  selectedActiveLayer.dates[slider.value].date);
                                }
                            })
                        ,
                        listeners: {
                            scope: this,
                            changecomplete: function(slider,val,thumb) { 
                                                              
                                
                               // which ever thumb was moved, update the selectedActiveLayer                                                              
                               this.setTimeVals(slider);  
                               //console.log(thumb.value);
                               //console.log(selectedActiveLayer.dates[thumb.value].date);
                               mergeNewTime(selectedActiveLayer.dates[thumb.value].date);  
                                
                                
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
                        fieldLabel: "Total Frames ",
                        disabled: true, // readonly            
                        grow: true,
                        text: selectedActiveLayer.dates.length,
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
                            animateTimePeriod();
                        }
                    }
                    
                ]
                Animations.TimePanel.superclass.initComponent.apply(this, arguments);
                
            },
            listeners: {
                afterrender: function(whateva) {
                    
                    // do this only once for each layer
                    // selectedActiveLayer.metadata.datesWithData will already be defined at this point
                    if (selectedActiveLayer.dates == undefined) {
                        setLayerDates(selectedActiveLayer); // pass in the layer as there are going to be many async Json requests
                        // disable the 'Start' button as we need all the available dates to be loaded first
                        Ext.getCmp('startNCAnimationButton').disable();
                    }
                    else {
                        //console.log("setting the startNCAnimationButton enabled");
                        // after a successful animation the 'Start' button is disabled
                        // the dates have been set previously for this layer so enable the button
                        Ext.getCmp('startNCAnimationButton').enable();
                    }
                    
                }
            },
            
            setTimeVals: function(slider) {
                
                var dates = selectedActiveLayer.dates;
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


// merge time = YYYY-MM-DD for getMap requests
function mergeNewTime(day) {     
    
    
    for(var i=0; i<selectedActiveLayer.dates.length; i++) {
        if (selectedActiveLayer.dates[i].date == day) {
            selectedActiveLayer.mergeNewParams({
                        time : day
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
    //var selectedDate = selectedActiveLayer.nearestTime;
    
    
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
    // set null when setDatetimesForDate return a result for every day
    layer.dayCounter = dayCounter;
    
}

// WTF happened to this function!!
// SVN Aghhhh!!
function pad(numNumber, numLength){
	var strString = '' + numNumber;
	while(strString.length<numLength){
		strString = '0' + strString;
	}
	return strString;
}

function setDatetimesForDate(layer, day) {
    
   // getMetadata gave us the days but not the times of the day
   Ext.Ajax.request({
        url: proxyURL+encodeURIComponent(layer.url + 
            "?request=GetMetadata&item=timesteps&layerName=" + 
            layer.params.LAYERS + 
            "&day=" + day),
        success: function(resp) { 
            
            var res = Ext.util.JSON.decode(resp.responseText);
            var dateTimes = [];
            res.timesteps.forEach(function (index) {
                
                 dateTimes.push(day +  "T" + index);
                
                
            });  
            // store the datetimes for each day
            for(var i=0; i<layer.dates.length; i++) {
                if (layer.dates[i].date == day) {
                    layer.dates[i].dateTimes = dateTimes;
                } 
            }
            
            layer.dayCounter--;
            // set null when setDatetimesForDate return a result for every day
            // now we are safe to allow animation
            if (layer.dayCounter == 0) {
                layer.dayCounter = undefined;
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
// for the selectedActiveLayer
function getDateTimesForDate(day) {
    var dateTimes = [];
    for(var i=0; i<selectedActiveLayer.dates.length; i++) {
        if (selectedActiveLayer.dates[i].date == day) {
            // console.log(selectedActiveLayer.dates[i]);
            dateTimes = selectedActiveLayer.dates[i].dateTimes;
        } 
    }
    return dateTimes;
    
}



// divide up the total amount of possible days into no more than thirty days
// the ncWMS server has trouble calculating an animated gif with more than 30 frames
function animateTimePeriod() {
    
    // disable the 'Start' button for the next possible layer
    Ext.getCmp('startNCAnimationButton').disable();
    
    if (animatePanel.animatePanelContent.theOnlyTimePanel != undefined) {
        //var maxFrames = 8;
        var chosenTimes = [];
        
        var p = animatePanel.animatePanelContent.theOnlyTimePanel; 
        
        /*****************
         * 
         * hard coded to two frames. start and end for the mo.
         * 
         */
        chosenTimes.push(getDateTimesForDate(p.timeMin.value)[0]); 
        chosenTimes.push(getDateTimesForDate(p.timeMax.value)[0]); 
        // get all the times between user selected range
        //var dates = setAnimationTimesteps(params);     
        
        selectedActiveLayer.chosenTimes = chosenTimes.join(",");
        
        addNCWMSLayer(selectedActiveLayer);
  
                
        
    }  

    
}



