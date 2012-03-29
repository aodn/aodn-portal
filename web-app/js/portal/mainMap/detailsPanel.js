var styleCombo;
//var detailsPanel;
//var detailsPanelItems;
var selectedLayer;
//var opacitySlider;
//var legendImage;
//var dimension;
var dimensionPanel;
var ncWMSColourScalePanel;
var colourScaleMin;
var colourScaleMax;

var animatePanel;

function initDetailsPanel()  {

    var animateLink =  new Ext.Button({  
        id: 'animateLink',
        text:'Animations',
        hidden: true,
        handler:setupAnimationControl
    });
    
    // for user to pick date range to animate
    animatePanel = new Ext.Panel({
        title: 'Date Animate',
        plain: true,
        disabled: true,
        stateful: false,
        autoScroll: true,
        bodyCls: 'floatingDetailsPanel',
        items: [
        {
            ref: 'animatePanelContent',       
            xtype: 'panel'                
        }
        ],
        listeners: {
            show: function(thisComponent) {  
                // the tabpanel needs to be visible before setup below
                setupAnimationControl();                

            }
        }
    });
    
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
                slider.setValue(0,selectedLayer.opacity * 100,true);
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
    
    var legendImage = new GeoExt.LegendImage({
        id: 'legendImage',
        imgCls: 'legendImage',
        flex: 1
    });
    
    var colourScaleHeader = new Ext.form.Label({
        html: "<h4>Set Parameter Range</h4>"
    });
    

    
    colourScaleMin = new Ext.form.TextField({
        fieldLabel: "Min",
        //layout:'form',
        enableKeyEvents: true,
        labelStyle: "width:30px",
        ctCls: 'smallIndentInputBox',
        grow: true,
        listeners: {
            keydown: function(textfield, event){
                updateScale(textfield, event);
            }
        }
    });

    colourScaleMax = new Ext.form.TextField({
        fieldLabel: "Max",
        //layout:'form',
        enableKeyEvents: true,
        labelStyle: "width:30px",
        //labelStyle: "",        
        ctCls: 'smallIndentInputBox',
        grow: true,
        listeners: {
            keydown: function(textfield, event){
                updateScale(textfield, event);
            }
        }
    });
    
    ncWMSColourScalePanel = new Ext.Panel({
        layout: 'form'
    });
    ncWMSColourScalePanel.add(colourScaleHeader,colourScaleMax,colourScaleMin);

    // create the styleCombo instance
    styleCombo = makeCombo("styles");
    
    var stylePanel = new Ext.Panel({
        id: 'stylePanel',
        title: 'Styles', 
        style: {margin: 5}, 
        autoHeight: 250,
        items: [
            styleCombo,   
            {
                xtype: 'panel',
                layout: 'hbox',
                autoScroll:true,
                align: 'stretch',
                items: [
                {
                    xtype: 'panel',                    
                    width: 130,
                    margin: 10,
                    items: [legendImage ]
                    },
                    ncWMSColourScalePanel
                ]
            }
        ]
    });
    
            
    var featureInfoPanel = new Ext.Panel({   
        title: 'Info',
        items: [
        {
            html: "latest graphs and stuff"
        }
        ]
    });  
    
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
        animatePanel
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
        animateLink, 
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
        
        updateStyles(layer);

        Ext.getCmp('opacitySlider').show(); // reset slider

        ncWMSColourScalePanel.hide();

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
        animatePanel.setDisabled(true);
        // assume its not an animated image
        Ext.getCmp('stopNCAnimationButton').setVisible(false);


        // it may be an animated image layer
        if (layer.originalWMSLayer != undefined) {

            // set the Start Stop buttons;
            Ext.getCmp('startNCAnimationButton').setVisible(false);
            Ext.getCmp('stopNCAnimationButton').setVisible(true);
        }


        updateDimensions(layer); // time and elevation   

        if(layer.server.type.search("NCWMS") > -1)  {

            makeNcWMSColourScale(layer); 

            transectControl.setMapPanel(getMapPanel());
            transectControl.layer = layer;
            transectControl.show();

            // show the animate tab if we can animate through time
            if (layer.metadata.datesWithData != undefined) {

                if (layer.dates == undefined) {
                    setLayerDates(layer); // pass in the layer as there are going to be many async Json requests
                }
                else {
                    animatePanel.setDisabled(false); 
                }

                // ensure to 're-set' the Start Stop buttons (if rendered);
                if (Ext.getCmp('startNCAnimationButton') != undefined) {
                    Ext.getCmp('startNCAnimationButton').setVisible(true);
                }
                Ext.getCmp('stopNCAnimationButton').setVisible(false);     
                animatePanel.doLayout();
            } 
        }

        var detailsPanel = getDetailsPanel();
        detailsPanel.text = layer.name;
        detailsPanel.setTitle("Layer Options: " + layer.name);
        Ext.getCmp('detailsPanelTabs').activate(0); // always set the first item active
        detailsPanel.doLayout();
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

function setChosenStyle(layer,record) {

    if (layer.originalWMSLayer == undefined) {
        // its a standard WMS layer
        selectedLayer.mergeNewParams({
            styles : record.get('displayText')
        });        
        
        // store the default style         
        selectedLayer.params.STYLES = record.get('myId');
        refreshLegend(selectedLayer);
    }
    else {
        // its an animated openlayers image
        // set the style on the original layer. the style will 'stick' to both
        layer.originalWMSLayer.params.STYLES = record.get('displayText');
        addNCWMSLayer(layer);      
        
    }

}
function updateStyles(layer) {

    var data = new Array();    
    styleCombo.hide();
    
    //var supportedStyles = layer.metadata.supportedStyles;
     // for WMS layers that we have scanned
    if(layer.allStyles != undefined) {
        
        // populate 'data' for the style options dropdown
        var styles = layer.allStyles.split(",");
        // do something if the user has more than one option
        if (styles.length > 1) { 
            
            for(var j = 0; j < styles.length; j++)  {
                var params = {
                    layer: layer,
                    colorbaronly: true                    
                }
                // its a ncwms layer
                if(layer.server.type.search("NCWMS") > -1)  {
                    var s = styles[j].split("/");
                    // if forward slash is found it is in the form  [type]/[palette]
                    // we only care about the palette part
                    s = (s.length > 1) ? s[1] : styles[j];
                    params.palette = s;
                }
                else {
                    params.style = styles[j];
                }                
    
                var imageUrl = buildGetLegend(params);         
                data.push([styles[j] , styles[j], imageUrl ]);
            }
        }
    } 
    
    
    if (data.length > 0) {
        // populate the stylecombo picker    
        styleCombo.store.loadData(data); 
        // change the displayed data in the style picker
        styleCombo.show();
    }
    refreshLegend(layer);
}

// full legend shown in layer option. The current legend
function refreshLegend(layer) {   
    
    var style = layer.params.STYLES;
    
    var params = {
        layer: layer,
        colorbaronly: false                    
    }
    
    // its a ncwms layer send 'palette'
    if(layer.server.type.search("NCWMS") > -1)  {
        var s = style.split("/");
        // if forward slash is found it is in the form  [type]/[palette]
        // we only care about the palette part
        s = (s.length > 1) ? s[1] : style;
        params.palette = s;
    }
    else {
        params.style = style;
    }
    var url = buildGetLegend(params) ;
    
    var img = Ext.getCmp('legendImage');
    img.setUrl(url);
    img.show();
    // dont worry if the form is visible here
    styleCombo.setValue(style);
}



// builds a getLegend image request for the combobox form and the selected palette
function buildGetLegend(params)   {
    
    var url = "";
    var useProxy = false;
    
    var layer = params.layer;
    var colorbaronly= params.colorbaronly; 
    var palette = params.palette;
    var style = params.style;
    
    
    // if this is an animated image then use the originals details
    // the params object is not set for animating images
    // the layer.url is for the whole animated gif
    if (layer.originalWMSLayer != undefined) {        
        layer.params = layer.originalWMSLayer.params;
        if (layer.originalWMSLayer.cache === true) {
             url = layer.originalWMSLayer.server.uri;
             useProxy = true;
        }
        else {
            url = layer.originalWMSLayer.url;
        }
        
    }
    else {
        if (layer.cache === true) {
             url = layer.server.uri;             
             useProxy = true;
        }
        else {
            url = layer.url;
        }
    }
    
    var opts = "";
        
    // thisPalette used for once off. eg combobox picker
    if (palette != undefined) {
        opts += "&PALETTE=" + palette;
     }        
   
    if (style != undefined) {
        opts += "&STYLE=" + style;
    }
    
    if (colorbaronly) {
        opts += "&LEGEND_OPTIONS=forceLabels:off";
        opts += "&COLORBARONLY=" + colorbaronly;
    }
    else {
        
        opts += "&LEGEND_OPTIONS=forceLabels:on";
    }
    
       
    if(layer.params.COLORSCALERANGE != undefined)
    {
        if(url.contains("COLORSCALERANGE"))  {            
            url = url.replace(/COLORSCALERANGE=([^\&]*)/, "");
        }            
        opts += "&COLORSCALERANGE=" + layer.params.COLORSCALERANGE;
        
    }    
    
    if (useProxy) {
        // FORMAT here is for the proxy, so that it knows its a binary image required
        url = proxyCachedURL+ encodeURIComponent(url) +  "&";
    }
    else {
        // see if this url already has some parameters on it
        if(url.contains("?"))  {            
            url +=  "&" ;
        }
        else {
            url +=  "?" ;
        }
    }
    
    opts += "&REQUEST=GetLegendGraphic"
        + "&LAYER=" + layer.params.LAYERS
        + "&FORMAT=" + layer.params.FORMAT;
    
    // strip off leading '&'
    opts = opts.replace(/^[&]+/g,"");
    url = url + opts
    
    
    return url;
}






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

function updateScale(textfield, event)
{
    //return key
    if(event.getKey() == 13)
    {
        if ( parseFloat(colourScaleMax.getValue()) > parseFloat(colourScaleMin.getValue())) {
            
            selectedLayer.mergeNewParams({
                COLORSCALERANGE: colourScaleMin.getValue() + "," + colourScaleMax.getValue()
            });
            refreshLegend(selectedLayer);
            
            // set the user selected range
            selectedLayer.metadata.userScaleRange = [colourScaleMin.getValue(),colourScaleMax.getValue()];
        }
        else {
            alert("The Max Parameter Range value is less than the Min");
        }
    }
}


function makeNcWMSColourScale(layer) {
    // see if the user has changed these values
    if (layer.metadata.userScaleRange != undefined) {
        colourScaleMin.setValue(selectedLayer.metadata.userScaleRange[0]);
        colourScaleMax.setValue(selectedLayer.metadata.userScaleRange[1]);
    }
    else if (layer.metadata.scaleRange != undefined) {
        colourScaleMin.setValue(selectedLayer.metadata.scaleRange[0]);
        colourScaleMax.setValue(selectedLayer.metadata.scaleRange[1]);     
    }
    ncWMSColourScalePanel.show(); 
    
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
