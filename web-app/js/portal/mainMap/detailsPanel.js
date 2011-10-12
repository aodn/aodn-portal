var styleCombo;
var detailsPanel;
var detailsPanelItems;
var selectedActiveLayer;
var opacitySlider;
var legendImage;
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
    animatePanel = new Ext.Panel({
        title: 'Date Picker',
        plain: true,
        disabled: true,
        autoScroll: true,
        bodyCls: 'floatingDetailsPanel',
        items: [
            {
                ref: 'animatePanelContent',       
                xtype: 'panel'                
            }
        ],
        listeners: {
            show: function(slider) {  
                // the tabpanel needs to be visible before setup below
                setupAnimationControl();
            }
        }
    });
    
    legendImage = new GeoExt.LegendImage({
        imgCls: 'legendImage'
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
        layout: 'form',
        height: 'auto',
        width: 200
    });
    ncWMSColourScalePanel.add(colourScaleHeader,colourScaleMax,colourScaleMin);

    // create a separate slider bound to the map but displayed elsewhere
    opacitySlider = new GeoExt.LayerOpacitySlider({
        id: "opacitySlider",
        layer: "layer",
        width: 200,
        margins: {
            top: 0,
            right: 10,
            bottom: 10,
            left: 10
        },
        inverse: false,
        fieldLabel: "opacity",
        plugins: new GeoExt.LayerOpacitySliderTip({
            template: '<div class="opacitySlider" >Opacity: {opacity}%</div>'
        })
    });


    // create the styleCombo instance
    styleCombo = makeCombo("styles");
    
    var stylePanel = new Ext.Panel({
        title: 'Styles', 
        items: [
            opacitySlider,
            styleCombo,                    
            legendImage,
            ncWMSColourScalePanel
        ]
    });
            
    var featureInfoPanel = new Ext.Panel({   
        title: 'Filters',
         items: [
            { html: "Filtering latest graphs and stuff"}
         ]
    });  
    
    detailsPanelItems = new Ext.TabPanel({  
        id: 'detailsPanelItems',   
        border: false,
        width: 300,
        activeTab: 0,
        cls: 'floatingDetailsPanelContent',
         items: [
             featureInfoPanel,
             stylePanel,
             animatePanel
         ]
    });
      
    

    // a floating popup
    detailsPanel =  new Ext.Window({
        
        defaults: {           
            padding: 10
        },
        id: 'detailsPanel',
        shadow: false,
        title: 'Layer Options',
        plain: true,
        autoDestroy: false,
        //padding: 10,
        constrainHeader: true,
        constrain: true,
        animCollapse: false,
        //collapsible: true,
        autoScroll: true,
        bodyCls: 'floatingDetailsPanel',
        //layout: 'absolute', // this is for the children
        //autoWidth: true,
        //autoHeight: true,
        closable: false,
        resizable: false, // still looking of a way of reinstating autosizing after a user has manual resized
        closeAction: 'hide',
        border: false,
        items: [         
            animateLink,    
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
            //afterrender: function(thisthingy){
            //    console.log("rendered the details panel");
            //    updateDetailsPanelPositionSize(false);
            //},            
            move: function(thisthingy,x,y){
                thisthingy.moved = true;
            },
            show: function(thisthingy){
                updateDetailsPanelPositionSize(true);
            }
            
        }
    
        

    });
    
  
    

}


// display in the popup or pin to the right of the main map
function toggleDetailsLocation() {
    
    var rdp = mapMainPanel.getComponent('rightDetailsPanel');
    if (detailsPanelItems.ownerCt.id == "detailsPanel") {
 
        rdp.add(detailsPanel.remove(detailsPanelItems, false));
        rdp.expand(true);
        rdp.doLayout();
        rdp.show();
        detailsPanel.hide();
    }
    else {        
        
        detailsPanel.add(rdp.remove(detailsPanelItems, false));
        // disable the opening of the righthand panel
        rdp.collapse(false);
        //rdp.hide();
        updateDetailsPanelPositionSize();
        detailsPanel.doLayout();     
        detailsPanel.show();
        
    }
}


function updateDetailsPanel(layer) {
    
    selectedActiveLayer = layer;
                    
                
    if (Portal.app.config.autoZoom) {
        zoomToLayer(mapPanel.map, selectedActiveLayer);
    }
    
    updateStyles(layer);
    updateDimensions(layer); // time and elevation   
    
    detailsPanel.text = selectedActiveLayer.name;
    detailsPanel.setTitle("Layer Options: " + selectedActiveLayer.name);
    mapMainPanel.getComponent('rightDetailsPanel').setTitle("Layer Options: " + selectedActiveLayer.name);
    opacitySlider.setLayer(selectedActiveLayer);


    ncWMSColourScalePanel.hide();
    //    
    if(selectedActiveLayer.server.type.search("NCWMS") > -1)  {
        makeNcWMSColourScale();
    }
    
    detailsPanelItems.activate(0); // always set the styles active
    
    
    // show the animate tab if we can animate through time
    if (selectedActiveLayer.metadata.datesWithData != undefined) {
        //Ext.getCmp('animateLink').show();
        //detailsPanelItems.doLayout();
        //animatePanel.doLayout();
        animatePanel.setDisabled(false);
        
        
    }
    else {
        //Ext.getCmp('animateLink').hide();
        //animateLink.hide();
        
        animatePanel.setDisabled(true);
    }
    
       
    
    // display popup if that is where the detailsPanelItems items are
    if (detailsPanelItems.ownerCt.id == "detailsPanel") {
        updateDetailsPanelPositionSize();
    }
    
    
}

// move to default spot unless a user has resized or moved the window
function updateDetailsPanelPositionSize(reset) {
    
    var buffer = 60;
    var x = Portal.app.config.westWidth+buffer;
    var y = Portal.app.config.headerHeight+buffer+ 40;
    
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

function updateStyles(layer)
{
     

    var data = new Array();
    
    styleCombo.hide();
    
    var ncWMSOptions = "";
    
    /*
     *Each layer advertises a number of STYLEs, 
     *each of which contains the name of the palette file, 
     *e.g. STYLES=boxfill/rainbow
    */
    var supportedStyles = selectedActiveLayer.metadata.supportedStyles;
    var palettes = selectedActiveLayer.metadata.palettes; 
    
    // for ncWMS layers most likely
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
    

    refreshLegend();
    
}


function refreshLegend()
{    
    var url = buildGetLegend(selectedActiveLayer,"",false)  
    legendImage.setUrl(url);
}

function buildGetLegend(layer,thisPalette,colorbaronly)   {
    
    var url = layer.url;
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




function makeNcWMSColourScale()
{

    if (selectedActiveLayer.metadata.scaleRange != undefined) {
        colourScaleMin.setValue(selectedActiveLayer.metadata.scaleRange[0]);
        colourScaleMax.setValue(selectedActiveLayer.metadata.scaleRange[1]);
        ncWMSColourScalePanel.show();      
    }
    {
        ncWMSColourScalePanel.hide();
    }
    
}


function makeCombo(type) {
    
    var tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p></div></tpl>';
    var fields;
    
    if (type == "styles") {
        tpl = '<tpl for="."><div class="x-combo-list-item"><p>{displayText}</p><img  src="{displayImage}" /></div></tpl>'
        fields = [
            {name: 'myId'},
            {name: 'displayText'},
            {name: 'displayImage'}
        ];
    }
    else {
        fields = [
            {name: 'myId'},
            {name: 'displayText'}
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
        lazyRender:true,
        mode: 'local',
        store: valueStore,
        emptyText: 'Layer '+ type +'...',
        valueField: 'myId',
        displayField: 'displayText',     
        tpl: tpl,
        listeners:{
            select: function(cbbox, record, index){
                if(cbbox.fieldLabel == 'styles')
                {    selectedActiveLayer.mergeNewParams({
                        styles : record.get('displayText')
                    });
                    selectedActiveLayer.metadata.defaultPalette = record.get('myId');
                    refreshLegend(); 
                }
                else if(cbbox.fieldLabel == 'time')
                {
                    selectedActiveLayer.mergeNewParams({
                        time : record.get('myId')
                    });
                }
                else if(cbbox.fieldLabel == 'elevation')
                {
                    selectedActiveLayer.mergeNewParams({
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
        if (colourScaleMax.getValue() > colourScaleMin.getValue()) {
            
            selectedActiveLayer.mergeNewParams({
                COLORSCALERANGE: colourScaleMin.getValue() + "," + colourScaleMax.getValue()
            });
            refreshLegend();
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