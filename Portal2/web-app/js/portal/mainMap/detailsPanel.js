var styleCombo;
var detailsPanel;
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
    
    // forget about GeoExt.LayerOpacitySlider as it cant handle setting a minimum value
    //var opacitySlider = new GeoExt.LayerOpacitySlider({
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
        items: [
        opacitySlider 
        ]
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
        featureInfoPanel,
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
            html: "<div id=\"transectinfostatus\">" +
            "<h5>Data along the transect: </h5>" + inf.line +  " " +
            "<BR><img src=\"" + inf.transectUrl + "\" />" +
            "</div>"
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
            //disabled: true, // readonly
            hidden: true,
            handler: function(button,event) {
                stopgetTimePeriod(selectedLayer);
            }
        },
        animateLink, 
        detailsPanelTabs
        ]
    });
      
    

    // a floating popup
    detailsPanel =  new Ext.Window({
        
        defaults: {           
            padding: 10
        },
        id: 'detailsPanel',
        
        width: 330, 
        layout: 'form',
        shadow: false,
        title: 'Layer Options',
        stateful: false,
        autoDestroy: false,
        hidden: true, // not visible until a user clicks a layer in active layers
        constrainHeader: true,
        constrain: true,
        animCollapse: false,
        autoScroll: true,
        bodyCls: 'floatingDetailsPanel',
        closable: false,
        resizable: false, // still looking of a way of reinstating autosizing after a user has manual resized
        closeAction: 'hide',
        border: false,
        items: [                     
        detailsPanelItems
        ],
        tools:[{
            id:'pin',
            qtip: 'Pin options to the right hand side of the window',
            handler: function(event, toolEl, panel){
                toggleDetailsLocation();
            }
        }],
        listeners: {            
            move: function(thisPanel,x,y){
                thisPanel.moved = true;
            }
            
        }         

    }); 

}


// display layer details in the popup or pin to the right of the main map
function toggleDetailsLocation() {
    var rdp = mapMainPanel.getComponent('rightDetailsPanel');
    var detailsPanelItems = Ext.getCmp('detailsPanelItems');
    
    if (detailsPanelItems.ownerCt.id == "detailsPanel") {
                    
        rdp.setVisible(true);
        rdp.add(detailsPanel.remove(detailsPanelItems, false));
        detailsPanel.hide();
        detailsPanelItems.doLayout();
        rdp.ownerCt.doLayout();
    }
    else {        
            
        detailsPanel.show();
        detailsPanel.add(rdp.remove(detailsPanelItems, false));
        detailsPanel.doLayout(); 
        updateDetailsPanelPositionSize();
        rdp.setVisible(false);  
        rdp.doLayout();
        rdp.ownerCt.doLayout(); // map will resize to fill empty space
        
    }
}

// The details panel may be in the right panel or in the detailsPanel popup
// simply hide the panel leaving it to the next updateDetailsPanel to reset things
function closeNHideDetailsPanel() {
    
    
    if (Ext.getCmp('detailsPanelItems').ownerCt.id == "detailsPanel") {        
        detailsPanel.hide();
    }
    else {      
        var rdp = mapMainPanel.getComponent('rightDetailsPanel');
        rdp.hide();
        rdp.ownerCt.doLayout(); // map will resize to fill empty space        
    }    
}


function updateDetailsPanel(layer) {
    
    selectedLayer = layer;
    Ext.getCmp('opacitySlider').show(); // reset slider
                    
                
    if (Portal.app.config.autoZoom === true) {
        zoomToLayer(mapPanel.map, layer);
    }
    
    
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
      
    updateStyles(layer);
    updateDimensions(layer); // time and elevation   
    
    if(layer.server.type.search("NCWMS") > -1)  {

        makeNcWMSColourScale(layer); 
        
        transectControl.setMapPanel(mapPanel);
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

        } 
    }
       

    if (Portal.app.config.hideLayerOptions === true) {
        
        closeNHideDetailsPanel();
        
    }
    else {    
        
        detailsPanel.text = layer.name;
        detailsPanel.setTitle("Layer Options: " + layer.name);
        mapMainPanel.getComponent('rightDetailsPanel').setTitle("Layer Options: " + layer.name);
        Ext.getCmp('detailsPanelTabs').activate(0); // always set the first item active  
         
        // display popup if that is where the Ext.getCmp('detailsPanelItems') items are
        if (Ext.getCmp('detailsPanelItems').ownerCt.id == "detailsPanel") {
            updateDetailsPanelPositionSize();
        }
        else{
            mapMainPanel.getComponent('rightDetailsPanel').show(true);  
            // resize the map so the panel isnt on top
            //mapMainPanel.doLayout();
        }
    }
    
    
}

// move to default spot unless a user has resized or moved the window
function updateDetailsPanelPositionSize(reset) {
    
    var widthBuffer = 60;
    var heightBuffer = 40;
    var x = Portal.app.config.westWidth+ widthBuffer;
    var y = Portal.app.config.headerHeight+ heightBuffer;
    detailsPanel.show();
    
    // set in predefined position unless already set or sized
    if (detailsPanel.lastSize.height == undefined && detailsPanel.moved == undefined ) {        
        detailsPanel.setPosition(x,y);  // this will cause detailsPanel.moved to be set 
    }    
    if (reset) {
        detailsPanel.setPosition(x,y);  // this will cause detailsPanel.moved to be set 
    // detailsPanel.restore();
    }
    
}

function setChosenStyle(layer,record) {
    
    if (layer.originalWMSLayer == undefined) {
        // its a standard WMS layer
        selectedLayer.mergeNewParams({
            styles : record.get('displayText')
        });        
        selectedLayer.metadata.defaultPalette = record.get('myId');
        refreshLegend(selectedLayer);
    }
    else {
        // its an animated openlayers image
        // set the style on the original layer. the style will 'stick' to both
        layer.originalWMSLayer.params.STYLES = record.get('displayText');
        addNCWMSLayer(layer);      
        
    }

}
function updateStyles(layer)
{
     

    var data = new Array();
    
    styleCombo.hide();
    
    
    /*
     *Each layer advertises a number of STYLEs, 
     *each of which contains the name of the palette file, 
     *e.g. STYLES=boxfill/rainbow
    */
    var supportedStyles = layer.metadata.supportedStyles;
    var palettes = layer.metadata.palettes; 
    
   
    // for ncWMS layers most likely and after getLayerMetadata has run
    if (supportedStyles != undefined) {
        
        styleCombo.store.removeAll();    
        styleCombo.clearValue();
        
        // supportedStyles is probably only one item 'boxfill'
        for(var i = 0;i < supportedStyles.length; i++)
        {
            for(var j = 0; j < palettes.length; j++)
            {
                var imageUrl = buildGetLegend(layer,palettes[j], true);                
                data.push([palettes[j] , supportedStyles[i] + "/" + palettes[j], imageUrl ]);
            }
            
        }
        // populate the stylecombo picker
        styleCombo.store.loadData(data);    
        
        styleCombo.show();
    }
    
    refreshLegend(layer);
    
}


function refreshLegend(layer) {    
    
    var url = buildGetLegend(layer,"",false) ; 
    Ext.getCmp('legendImage').setUrl(url); 
    Ext.getCmp('stylePanel').doLayout();
    //
}

// builds a getLegend image request for the combobox form and the selected palette
function buildGetLegend(layer,thisPalette,colorbaronly)   {
    
    var url = "";
    
    // if this is an animated image then use the originals details
    // the params object is not set for animating images
    // the layer.url is for the whole animated gif
    if (layer.originalWMSLayer != undefined) { 
        layer.params = layer.originalWMSLayer.params;
        url = layer.originalWMSLayer.url;
    }
    else {
        url = layer.url;
    }
    
    
    var opts = "";
        
    // thisPalette used for once off. eg combobox picker
    if (thisPalette == "") {
        // a style may have been set this session or from the server
        if (layer.metadata.defaultPalette != undefined) {
            opts = "PALETTE=" + layer.metadata.defaultPalette;
        }        
        opts += "&LEGEND_OPTIONS=forceLabels:on";
    }
    else {
        opts = "PALETTE=" + thisPalette;
    }
    
    if (colorbaronly) {
        
        opts += "&COLORBARONLY=" + colorbaronly;
    }
    
    
    url +=  "?" + opts 
    + "&REQUEST=GetLegendGraphic"
    + "&LAYER=" + layer.params.LAYERS
    + "&FORMAT=" + layer.params.FORMAT; 
    
    
    if(layer.params.COLORSCALERANGE != undefined)
    {
        if(url.contains("COLORSCALERANGE"))
        {
            url = url.replace(/COLORSCALERANGE=([^\&]*)/, "COLORSCALERANGE=" + layer.params.COLORSCALERANGE);
        }
        else
        {
            url += "&COLORSCALERANGE=" + layer.params.COLORSCALERANGE;
        }
    }    
    return url
}




function makeNcWMSColourScale(layer)
{

    if (layer.metadata.scaleRange != undefined) {
        colourScaleMin.setValue(selectedLayer.metadata.scaleRange[0]);
        colourScaleMax.setValue(selectedLayer.metadata.scaleRange[1]);
        ncWMSColourScalePanel.show();      
    }
    
    
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
        emptyText: 'Layer '+ type +'...',
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
        }
        else {
            alert("The Max Parameter Range value is less than the Min");
        }
    }
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