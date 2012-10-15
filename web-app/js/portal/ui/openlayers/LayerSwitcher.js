Ext.namespace('Portal.ui.openlayers');

Portal.ui.openlayers.LayerSwitcher = Ext.extend(OpenLayers.Control.LayerSwitcher, {
	
	actionsLbl: null,
	
	actionsDiv: null,
	
	loadContents: function() {
		
		OpenLayers.Control.LayerSwitcher.prototype.loadContents.apply(this);
		
        this.actionsLbl = document.createElement("div");
        this.actionsLbl.innerHTML = OpenLayers.i18n("layerActions");
        OpenLayers.Element.addClass(this.actionsLbl, "actionsLbl");
        
        this.actionsDiv = document.createElement("div");
        OpenLayers.Element.addClass(this.actionsDiv, "actionsDiv");

        this.layersDiv.appendChild(this.actionsLbl);
        this.layersDiv.appendChild(this.actionsDiv);
        
        this.addAutoZoomElement();
        this.addRemoveAllElement();
        this.addResetMapElement();
	},
	
	addAutoZoomElement: function() {
		
        var autoZoomElem = document.createElement("input");
        autoZoomElem.id = this.id + "_input_auto_zoom";
        autoZoomElem.name = this.id;
        autoZoomElem.type = "checkbox";
        autoZoomElem.value = null;
        autoZoomElem.checked = false;
        autoZoomElem.defaultChecked = false;
        
        this.autoZoomElem = autoZoomElem;
        this.autoZoomLabelSpan = this.addElementInSpan(autoZoomElem, OpenLayers.i18n('autoZoomControlLabel'), this.autoZoomClicked);
	},

	addRemoveAllElement: function() {
		
		this.addHtmlLinkElement(OpenLayers.i18n('removeAllControlLabel'));
	},

	
	addResetMapElement: function() {
		
		this.addHtmlLinkElement(OpenLayers.i18n('resetMapControlLabel'));
	},

	addHtmlLinkElement: function(label) {
		
		var htmlElem = document.createElement("a");
		htmlElem.innerHTML = label;
		htmlElem.href = "";
		htmlElem.setAttribute('style', 'color: white;');
		this.actionsDiv.appendChild(htmlElem);
		this.actionsDiv.appendChild(document.createElement("br"));
	},
	
	addElementInSpan: function(elem, label, handler) {
		
        var context = {
                'inputElem': elem,
                'layerSwitcher': this
        };
        
        OpenLayers.Event.observe(elem, "mouseup", 
            OpenLayers.Function.bindAsEventListener(handler,
                                                    context)
        );

        // create span
        var labelSpan = document.createElement("span");
        OpenLayers.Element.addClass(labelSpan, "labelSpan");
        labelSpan.innerHTML = label;
        labelSpan.style.verticalAlign = "baseline";
        OpenLayers.Event.observe(labelSpan, "click", 
            OpenLayers.Function.bindAsEventListener(handler,
                                                    context)
        );
        
        // create line break
        var br = document.createElement("br");

        var groupDiv = this.actionsDiv;
        groupDiv.appendChild(elem);
        groupDiv.appendChild(labelSpan);
        groupDiv.appendChild(br);
            
        return labelSpan; 
	},
    
    isAutoZoomEnabled: function() {
    	return this.autoZoomElem.checked;
    },
    
    autoZoomClicked: function() {
    	
    	this.layerSwitcher.autoZoomElem.checked = !this.layerSwitcher.autoZoomElem.checked;
    }
});
