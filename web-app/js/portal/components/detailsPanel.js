var styleCombo;
var detailsPanel;
var detailsPanelInitX = 340;
var detailsPanelInitY = 140;
var detailsPanelItems;
var detailsPanelLayer;
var opacitySlider;
var legendImage;
var dimension;
var dimensionPanel;
var ncWMSColourScalePanel;
var colourScaleMin;
var colourScaleMax;


function initDetailsPanel()  {
    
    legendImage = new GeoExt.LegendImage({
        imgCls: 'legendImage'
    });
    
    
    var t = new Ext.Template([
        '<div name="{id}">',
            '<span class="{cls}">{name:trim} {value:ellipsis(10)}</span>',
        '</div>',
    ]);
    //t.compile();
    //t.append('some-element', {id: 'myid', cls: 'myclass', name: 'foo', value: 'bar'});
    
    var colourScaleHeader = new Ext.form.Label({
        html: "<h4>Set Parameter Range</h4>"
    });
    colourScaleMin = new Ext.form.TextField({
        fieldLabel: "Min",
        layout:'form',
        enableKeyEvents: true,
        labelStyle: "width:30px",
        //style: {paddingLeft:"55px"}, // only on input 
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
        layout:'form',
        enableKeyEvents: true,
        labelStyle: "width:30px",
        //labelStyle: "",   
        //style: {paddingLeft:"55px"}, // only on input         
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
    ncWMSColourScalePanel.add(colourScaleHeader,colourScaleMin, colourScaleMax);

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
    
    
    detailsPanelItems = new Ext.Container({  
        id: 'detailsPanelItems',
        defaults: {            
            bodyStyle:'padding:5px 2px'
        },        
        cls: 'floatingDetailsPanelContent',
         items: [
            opacitySlider, 
            styleCombo, 
            legendImage,
            ncWMSColourScalePanel
         ]
    });
    

    
    detailsPanel =  new Ext.Window({
        id: 'detailsPanel',
        shadow: false,
        title: 'Layer Options',
        plain: true,
        autoDestroy: false,
        padding: 10,
        constrainHeader: true,
        constrain: true,
        //collapsible: true,
        autoScroll: true,
        bodyBorder: false,
        bodyCls: 'floatingDetailsPanel',
        //layout: 'absolute', // this is for the children
        //autoWidth: true,
        //autoHeight: true,
        closable: false,
        closeAction: 'hide',
        border: false,
        x: detailsPanelInitX,
        y: detailsPanelInitY,
        items: [
            detailsPanelItems
        ],
        tools:[{
            id:'pin',
            qtip: 'Pin options to the right hand side of the window',
            handler: function(event, toolEl, panel){
                toggleDetailsLocation();
            }
        }]

    });


    

}


function toggleDetailsLocation() {
    
    var rdp = viewport.getComponent('rightDetailsPanel');
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
        rdp.hide();
        updateDetailsPanelPosition();
        detailsPanel.doLayout();     
        detailsPanel.show();
        
    }
}


function updateDetailsPanel(layer) {
    
    detailsPanelLayer = layer;
    
    updateStyles(layer);
    updateDimensions(layer);    
    
    detailsPanel.text = detailsPanelLayer.name;
    detailsPanel.setTitle("Layer Options: " + detailsPanelLayer.name);
    opacitySlider.setLayer(detailsPanelLayer);


    ncWMSColourScalePanel.hide();
    if(detailsPanelLayer.server.type.search("NCWMS") > -1)
    {
        makeNcWMSColourScale();
    }
    
    // display popup if that where the detailsPanelItems items are
    if (detailsPanelItems.ownerCt.id == "detailsPanel") {
        updateDetailsPanelPosition();
    }
    
    
}
function updateDetailsPanelPosition() {
    
    detailsPanel.show();        

    //if a user has resized or moved the popup then leave it alone
    console.log((detailsPanel.lastSize.height!= undefined)+" && "+((detailsPanel.x != detailsPanelInitX) ||(detailsPanel.y != detailsPanelInitY)));
    if (detailsPanel.lastSize.height != undefined && (detailsPanel.x != detailsPanelInitX || detailsPanel.y != detailsPanelInitY)) {
        console.log("set postion");
        detailsPanel.setPosition(detailsPanelInitX,detailsPanelInitY);
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
    var supportedStyles = detailsPanelLayer.metadata.supportedStyles;
    var palettes = detailsPanelLayer.metadata.palettes; 
    
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
    var url = buildGetLegend(detailsPanelLayer,"",false)  
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


function updateDimensions(layer)
{
    var dims = layer.metadata.dimensions;
    //alert(layer.metadata);
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
                detailsPanel.add(ncWMSColourScalePanel);
            }
            
        }
    }
    
}



function makeNcWMSColourScale()
{
    //Example: http://ncwms.emii.org.au/ncWMS/wms?item=layerDetails&layerName=ACORN_raw_data_SAG%2FSPEED&time=2006-09-19T12%3A00%3A00.000Z&request=GetMetadata
    /*
    if(detailsPanelLayer.params.colourScale == undefined)
    {
        Ext.Ajax.request({
            url: proxyURL+encodeURIComponent(detailsPanelLayer.url + "?item=layerDetails&request=GetMetadata&layerName=" + detailsPanelLayer.params.LAYERS),
            success: function(resp){
                var metadata = Ext.util.JSON.decode(resp.responseText);
                colourScaleMin.setValue(metadata.scaleRange[0]);
                colourScaleMax.setValue(metadata.scaleRange[1]);
            }
        });
    }
    */
    colourScaleMin.setValue(detailsPanelLayer.metadata.scaleRange[0]);
    colourScaleMax.setValue(detailsPanelLayer.metadata.scaleRange[1]);
    ncWMSColourScalePanel.show();
    

     
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
                {    detailsPanelLayer.mergeNewParams({
                        styles : record.get('displayText')
                    });
                    detailsPanelLayer.metadata.defaultPalette = record.get('myId');
                    refreshLegend(); 
                }
                else if(cbbox.fieldLabel == 'time')
                {
                    detailsPanelLayer.mergeNewParams({
                        time : record.get('myId')
                    });
                }
                else if(cbbox.fieldLabel == 'elevation')
                {
                    detailsPanelLayer.mergeNewParams({
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
        detailsPanelLayer.mergeNewParams({
            COLORSCALERANGE: colourScaleMin.getValue() + "," + colourScaleMax.getValue()
        });

        refreshLegend();
    }
}
