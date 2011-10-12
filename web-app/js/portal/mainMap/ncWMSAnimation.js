

function setupAnimationControl() {
    
    
    if (selectedActiveLayer == undefined) {
        console.log("animation was requested although no layer is active!!");
        return false;
    }    

    
    if (selectedActiveLayer.dates == undefined) {
        selectedActiveLayer.dates = selectedActiveLayerDates();
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

// get all the dates for the aselected active layer
function selectedActiveLayerDates(){
    
    var dates = [];   
    var datesWithData = selectedActiveLayer.metadata.datesWithData; 
    //var selectedDate = selectedActiveLayer.nearestTime;
    
    for (var year in datesWithData) {
        for (var month in datesWithData[year]) {            
            for (var day in datesWithData[year][month]) {
                // add 1 to the month and number as datesWithData uses a zero-based months
                // take the value at the index day if its a number
                if (!isNaN(parseInt(datesWithData[year][month][day]))) {
                    
                    dates.push(year + "-" + pad(parseInt(month)+1, 2 ) +"-" + pad(datesWithData[year][month][day], 2));
                }
            }
        }        
    }
    return dates;
    
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
                                    return String.format('<b>{0}:</b> {1}', thumbName,  selectedActiveLayer.dates[slider.value]);
                                }
                            })
                        ,
                        listeners: {
                            scope: this,
                            changecomplete: function(slider,val,thumb) { 
                                                              
                                
                               // which ever thumb was moved, update the selectedActiveLayer
                               // getMetadata gave us the days but not the times of the day
                               Ext.Ajax.request({
                                    url: proxyURL+encodeURIComponent(selectedActiveLayer.url + 
                                        "?request=GetMetadata&item=timesteps&layerName=" + 
                                        selectedActiveLayer.params.LAYERS + 
                                        "&day=" + selectedActiveLayer.dates[val]),        
                                    success: function(resp) { 
                                        selectedActiveLayer.selectedDayTimesteps = Ext.util.JSON.decode(resp.responseText);
                                        mergeNewTime(selectedActiveLayer.dates[val]);
                                    }
                                }); 
                                
                                this.setTimeVals(slider);                               
                                
                                
                                
                            },
                            afterrender: function(slider) {  
                                this.setTimeVals(this.timePanelSlider);
                                //renderAnimatePanelContents();
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
                        text:'Start',
                        //disabled: true, // readonly
                        //hidden: true,
                        handler:animateTimePeriod(this)
                    }
                    
                ]
                Animations.TimePanel.superclass.initComponent.apply(this, arguments);
                
            },
            listeners: {

            },
            

            
            resetSlider: function(slider) {
                
                slider.setValue(0,0,true);
                slider.setValue(1,0,true);
                slider.setMinValue(0);
                slider.setMaxValue(0);
                
                if (selectedActiveLayer.dates.length > 1) {
                    slider.setMaxValue(selectedActiveLayer.dates.length-1);
                    slider.setValue(1,selectedActiveLayer.dates.length-1,true);
                }
                
               
                
            },
            
            setTimeVals: function(slider) {
                
                var dates = selectedActiveLayer.dates;
                this.timeMin.setValue(dates[slider.getValues()[0]]);
                
                if (slider.getValues()[1] != undefined) {
                    this.timeMax.setValue(dates[slider.getValues()[1]]);
                    this.frameCount.setValue(slider.getValues()[1] -  slider.getValues()[0] + 1); // + item at zero
                }
                else {
                    this.timeMax.setValue(undefined);
                    this.frameCount.setValue(undefined);
                }
                
            }
            
            
      
}); 
Ext.reg('animations.timePanel', Animations.TimePanel);



// divide up the total amount of possible days into no more than thirty days
// the ncWMS server has trouble calculating an animated gif with more than 30 frames
function animateTimePeriod(thisTimePanel) {
    
    if (animatePanel.animatePanelContent.theOnlyTimePanel == undefined) {
        
        //
        var p = animatePanel.animatePanelContent.theOnlyTimePanel;
        //console.log(p);
        var timeArray = [];
        //timeArray.push(thisTimePanel.timeMin.getvalue());    
        //timeArray.push(thisTimePanel.timeMax.getvalue());

        
        
    }  

    
}



/**
 * Gets the list of animation timesteps from the given layer ncWMS.
 * @param Object containing parameters, which must include:
 *        start Start time for the animation in ISO8601
 *        start End time for the animation in ISO8601
 */
function getAnimationTimesteps(url, params) {
    makeAjaxRequest(url, {
        urlparams: {
            item: 'animationTimesteps',
            layerName: params.layerName,
            start: params.startTime,
            end: params.endTime
        },
        onSuccess: function(timestrings) {
            return timestrings.timeStrings;
        }
    });
}

// called after ajax request to get the timesteps for a given date
function mergeNewTime(dateTime) {
    
   
   var salsdtt = selectedActiveLayer.selectedDayTimesteps.timesteps;
   // take the first one for now !!!!!!!!!!!!!!!!!!!!!!!!!!
   if (salsdtt != undefined) {
       dateTime = dateTime + "T" + salsdtt[0];
   }
   else {
       // Dont know what to do at this stage ?????????? todo       
       console.log('non-standard  response to getmetadat timesteps!!!');
       return false;
   }     
    
   selectedActiveLayer.mergeNewParams({
                        time : dateTime
                    });
}

