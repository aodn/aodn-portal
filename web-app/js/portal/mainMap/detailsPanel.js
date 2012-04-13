var selectedLayer;
var dimensionPanel;

function initDetailsPanel()  {
    var opacitySlider = new Ext.slider.SingleSlider({
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
    
    var opacitySliderContainer = new Ext.Panel({ 
        height: 'auto',
        layout: 'form',
        items: [opacitySlider]
    });

    var stylePanel = new Portal.details.StylePanel();

    var featureInfoPanel = new Ext.Panel({
        title: 'Info',
        items: [
        {
            html: "latest graphs and stuff"
        }
        ]
    });

    var animationPanel = new Portal.details.AnimationPanel();
    
    var detailsPanelTabs = new Ext.TabPanel({  
        defaults: {
            margin: 10
        }, 
        id: 'detailsPanelTabs',
        ref: 'detailsPanelTabs',
        border: false,
        activeTab: 0,
        enableTabScroll: true,
        cls: 'floatingDetailsPanelContent',
        items: [
        //featureInfoPanel, // implement when there is something to see
        stylePanel,
        animationPanel
        ]
    });
    
    var transectControl = new Portal.mainMap.TransectControl({
      ref: 'transectControl',
      listeners: {
        transect: function(inf) {
          var newTab = detailsPanelTabs.add({
            title: OpenLayers.i18n('transectTab'),
            autoHeight: true,
            closable: true,
            items: [{
              layout: 'hbox',
              items: [{
                autoHeight: true,
                width: 200,
                //TODO: use template
                html: "<h5>" + OpenLayers.i18n('transectDataHeading')+ "</h5>" + inf.line +  " " 
              },{
                autoHeight: true,
                hidden: inf.dimensionValues == '',
                //TODO: use template
                html: "<h5>" + OpenLayers.i18n('dimensionValuesHeading') + "</h5>" + inf.dimensionValues
              }]
            },{
              autoHeight: true,
              //TODO: use template
              html: "<img src=\"" + inf.transectUrl + "\" />"
            }]
          });
          
          if (detailsPanelItems.ownerCt.width <  430) {
            detailsPanelItems.ownerCt.setWidth(430);
            if (detailsPanelItems.ownerCt.ownerCt) detailsPanelItems.ownerCt.ownerCt.doLayout();
          }
          
          detailsPanelTabs.setActiveTab(detailsPanelTabs.items.indexOf(newTab));
       }
      }
    });

    var detailsPanelItems = new Ext.Panel({
        id: 'detailsPanelItems',
        autoWidth: true,
        //    style: {
        //        padding: '10px'
        //    },
        items: [
        opacitySliderContainer,
        transectControl,
        {
            xtype: 'button',
            id: 'stopNCAnimationButton',
            text:'Stop Animation',
            hidden: true
        },
        detailsPanelTabs
        ]
    });
}


// display layer details in the popup or pin to the right of the main map
function toggleDetailsLocation() {
	// Do nothing now
}

// The details panel may be in the right panel or in the detailsPanel popup
// simply hide the panel leaving it to the next updateDetailsPanel to reset things
function closeNHideDetailsPanel() {
    rightPanel = Ext.getCmp('rightDetailsPanel');

    if (Portal.app.config.hideLayerOptions === true) {
        if(rightPanel.getEl() != undefined){
            rightPanel.collapse(true);
        }
    }
    else {
        if(rightPanel.getEl() != undefined){
            rightPanel.expand(true);
        }
    }
}


function updateDetailsPanel(layer) {
    
    closeNHideDetailsPanel();


    // show new layer unless user requested 'hideLayerOptions' or
    // check if the map is still in focus - not the search
    if (!(Portal.app.config.hideLayerOptions === true || !viewport.isMapVisible() )) {
        selectedLayer = layer;
        Ext.getCmp('opacitySlider').show(); // reset slider

        Ext.getCmp('ncWMSColourScalePanel').hide();

        var transectControl = Ext.getCmp('detailsPanelItems').transectControl;
        transectControl.hide();

        // remove any transect tabs for previous layer
        var detailsPanelTabs = Ext.getCmp('detailsPanelItems').detailsPanelTabs;
        var transectTabs = detailsPanelTabs.find('title', OpenLayers.i18n('transectTab'));
        for (var i=0;i<transectTabs.length;i++) {
          detailsPanelTabs.remove(transectTabs[i]);
        }

        // set default visibility of components in this panel     
        // disabled until all dates are loaded for the layer if applicable      
        Ext.getCmp('animationPanel').setDisabled(true);
        // assume its not an animated image
        Ext.getCmp('stopNCAnimationButton').setVisible(false);


        // it may be an animated image layer
        if (layer.originalWMSLayer != undefined) {

            // set the Start Stop buttons;
            Ext.getCmp('startNCAnimationButton').setVisible(false);
            Ext.getCmp('stopNCAnimationButton').setVisible(true);
        }


        Ext.getCmp('stylePanel').updateStyles(layer);
        updateDimensions(layer); // time and elevation   

        if(layer.server.type.search("NCWMS") > -1)  {

            Ext.getCmp('ncWMSColourScalePanel').makeNcWMSColourScale(layer);

            transectControl.setMapPanel(getMapPanel());
            transectControl.layer = layer;
            transectControl.show();

            // show the animate tab if we can animate through time
            if (layer.metadata.datesWithData != undefined) {

                if (layer.dates == undefined) {
                    setLayerDates(layer); // pass in the layer as there are going to be many async Json requests
                }
                else {
                    Ext.getCmp('animationPanel').setSelectedLayer(layer);
                    Ext.getCmp('animationPanel').setDisabled(false);
                }

                // ensure to 're-set' the Start Stop buttons (if rendered);
                if (Ext.getCmp('startNCAnimationButton') != undefined) {
                    Ext.getCmp('startNCAnimationButton').setVisible(true);
                }
                Ext.getCmp('stopNCAnimationButton').setVisible(false);     
                Ext.getCmp('animationPanel').doLayout();
            } 
        }
        

        var detailsPanel = getDetailsPanel();
        detailsPanel.text = layer.name;
        detailsPanel.setTitle("Layer Options: " + layer.name);
        Ext.getCmp('detailsPanelTabs').activate(0); // always set the first item active
        detailsPanel.doLayout.defer(50, this); // wait for browser to resize autoHeight elements before doing layout
    }
}

// move to default spot unless a user has resized or moved the window
//function updateDetailsPanelPositionSize(reset) {
//    
//    var widthBuffer = 60;
//    var heightBuffer = 40;
//    var x = Portal.app.config.westWidth+ widthBuffer;
//    var y = Portal.app.config.headerHeight+ heightBuffer;
//    
//    var detailsPanel = getDetailsPanel();
//    detailsPanel.show();
//    // set in predefined position unless already set or sized
//    if (detailsPanel.lastSize.height == undefined && detailsPanel.moved == undefined ) {        
//        detailsPanel.setPosition(x,y);  // this will cause detailsPanel.moved to be set 
//    }    
//    if (reset) {
//        detailsPanel.setPosition(x,y);  // this will cause detailsPanel.moved to be set 
//    // detailsPanel.restore();
//    }
//}


function makeCombo(type) {
    
    var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';
    var fields;
    
    if (type == "styles") {
        tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p><img  src="{displayImage}" /></div></tpl>'
        fields = [
        {
            name: 'myId'
        },

        {
            name: 'displayText'
        },

        {
            name: 'displayImage'
        }
        ];
    }
    else {
        fields = [
        {
            name: 'myId'
        },

        {
            name: 'displayText'
        }
        ];
    }
    
    var valueStore  = new Ext.data.ArrayStore({
        autoDestroy: true,
        itemId: type,
        name: type,
        fields: fields
    });

    var combo = new Ext.form.ComboBox({
        fieldLabel: type,
        triggerAction: 'all',
        editable : false,
        lazyRender:true,
        mode: 'local',
        store: valueStore,
        emptyText: OpenLayers.i18n('pickAStyle'),
        valueField: 'myId',
        displayField: 'displayText',     
        tpl: tpl,
        style: {
           // marginTop: '10px'
        },
        listeners:{
            select: function(cbbox, record, index){
                if(cbbox.fieldLabel == 'styles')
                {    
                    setChosenStyle(selectedLayer,record); 
                }
                else if(cbbox.fieldLabel == 'time')
                {
                    selectedLayer.mergeNewParams({
                        time : record.get('myId')
                    });
                }
                else if(cbbox.fieldLabel == 'elevation')
                {
                    selectedLayer.mergeNewParams({
                        elevation : record.get('myId')
                    });
                }
            }
        }
    });
    
    return combo;
}






// for static time and elevation
// TODO
function updateDimensions(layer)
{
    var dims = layer.metadata.dimensions;
    //alert(layer.metadata.dimensions);
    if(dims != undefined)
    {
        for(var d in dims)
        {
            if(dims[d].values != undefined)
            {
                var valList = dims[d].values;
                var dimStore, dimData;

                dimData = new Array();

                dimCombo = makeCombo(d);
                dimStore = dimCombo.store;
                dimStore.removeAll();

                for(var j = 0; j < valList.length; j++)
                {
                    //trimming function thanks to
                    //http://developer.loftdigital.com/blog/trim-a-string-in-javascript
                    var trimmed = valList[j].replace(/^\s+|\s+$/g, '') ;
                    dimData.push([j, trimmed, trimmed]);
                }

                dimStore.loadData(dimData);
                detailsPanel.add(dimCombo);
            }
            
        }
    }
    
}

// Until this is refactored have single global point of return for the details panel
function getDetailsPanel() {
	return Ext.getCmp('rightDetailsPanel');
}
