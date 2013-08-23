
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.ui.openlayers');

Portal.ui.openlayers.MapActionsControl = OpenLayers.Class(OpenLayers.Control, {

    actionsPanel : null,
	window: null,

    /**
     * APIProperty: roundedCorner {Boolean} If true the Rico library is used for
     * rounding the corners of the layer switcher div, defaults to true.
     */
    roundedCorner : true,

    /**
     * APIProperty: roundedCornerColor {String} The color of the rounded
     * corners, only applies if roundedCorner is true,
     */
    roundedCornerColor : "#34546E",

    layersDiv : null,

    /**
     * Property: minimizeDiv {DOMElement}
     */
    minimizeDiv : null,

    /**
     * Property: maximizeDiv {DOMElement}
     */
    maximizeDiv : null,

    /**
     * Constructor: OpenLayers.Control.LayerSwitcher
     *
     * Parameters: options - {Object}
     */
    initialize : function(options) {

        OpenLayers.Control.prototype.initialize.apply(this, arguments);

        this.appConfig = options;
    },

    /**
     * APIMethod: destroy
     */
    destroy : function() {

        OpenLayers.Event.stopObservingElement(this.div);

        OpenLayers.Event.stopObservingElement(this.minimizeDiv);
        OpenLayers.Event.stopObservingElement(this.maximizeDiv);

        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: setMap
     *
     * Properties: map - {<OpenLayers.Map>}
     */
    setMap : function(map) {
        OpenLayers.Control.prototype.setMap.apply(this, arguments);
    },

    /**
     * Method: draw
     *
     * Returns: {DOMElement} A reference to the DIV DOMElement containing the
     * switcher tabs.
     */
    draw : function() {
        OpenLayers.Control.prototype.draw.apply(this);

        // create layout divs
        this.loadContents();

        // set mode to minimize
        if (!this.outsideViewport) {
            this.minimizeControl();
        }

        return this.div;
    },

    loadContents : function() {

        // configure main div

        // OpenLayers.Event.observe(this.div, "mouseup",
        // OpenLayers.Function.bindAsEventListener(this.mouseUp, this));
        OpenLayers.Event.observe(this.div, "click", this.ignoreEvent);
        OpenLayers.Event.observe(this.div, "mousedown", OpenLayers.Function
                .bindAsEventListener(this.mouseDown, this));
        OpenLayers.Event.observe(this.div, "dblclick", this.ignoreEvent);

        // layers list div
        this.layersDiv = document.createElement("div");
        this.layersDiv.id = this.id + "_layersDiv";
        OpenLayers.Element.addClass(this.layersDiv, "layersDiv");

        this.div.appendChild(this.layersDiv);

        if (this.roundedCorner) {
            OpenLayers.Rico.Corner.round(this.div, {
                corners : "tl bl",
                bgColor : "transparent",
                color : this.roundedCornerColor,
                blend : false
            });
            OpenLayers.Rico.Corner.changeOpacity(this.layersDiv, 0.85);
        }

        var imgLocation = OpenLayers.Util.getImagesLocation();
        var sz = new OpenLayers.Size(18, 18);

        // maximize button div
        var img = imgLocation + 'layer-switcher-maximize.png';
        this.maximizeDiv = OpenLayers.Util.createAlphaImageDiv(
                "OpenLayers_Control_MaximizeDiv", null, sz, img, "absolute");
        OpenLayers.Element.addClass(this.maximizeDiv, "maximizeDiv");
        this.maximizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.maximizeDiv, "click", OpenLayers.Function
                .bindAsEventListener(this.maximizeControl, this));

        this.div.appendChild(this.maximizeDiv);

        // minimize button div
        img = imgLocation + 'layer-switcher-minimize.png';
        this.minimizeDiv = OpenLayers.Util.createAlphaImageDiv(
                "OpenLayers_Control_MinimizeDiv", null, sz, img, "absolute");
        OpenLayers.Element.addClass(this.minimizeDiv, "minimizeDiv");
        this.minimizeDiv.style.display = "none";
        OpenLayers.Event.observe(this.minimizeDiv, "click", OpenLayers.Function
                .bindAsEventListener(this.minimizeControl, this));

        this.div.appendChild(this.minimizeDiv);

        this.actionsPanel = new Portal.ui.ActionsPanel({
            map : this.appConfig.mapPanel.map,
            layerStore : this.appConfig.mapPanel.layers,
            mapScope : this.appConfig.mapPanel
        });

		this.window = new Ext.Window({
            id : 'mapActionsWindow',
            draggable : false,
            hidden : false,
            closable : false,
            border : false,
            bodyBorder : false,
            resizable : false,
            autoHeight: true,
            layout:  'fit',
            // This magic number exists because without it, the contents of this window don't show.
            // There is no doubt a better way to do this (based on the sizes of content, for exmaple),
            // be my guest if you can get it to work.
            width: 300,
            afterRender : function() {

                Ext.Window.superclass.afterRender.apply(this);
                this.el.dom.style.position = "";
            },
            items: this.actionsPanel
        });

        this.layersDiv.appendChild(this.window.el.dom);
        this.registerActionPanelEventListeners();
    },

    registerActionPanelEventListeners: function() {

        this.actionsPanel.on('zoomtolayer', this.appConfig.mapPanel.zoomToLayer, this.appConfig.mapPanel);

        this.actionsPanel.on('autozoomchecked', this.appConfig.mapPanel.autoZoomCheckboxHandler, this.appConfig.mapPanel);
        this.actionsPanel.on('autozoomunchecked', this.appConfig.mapPanel.autoZoomCheckboxHandler, this.appConfig.mapPanel);

        this.appConfig.mapPanel.relayEvents(this.actionsPanel, ['removelayer']);
    },

    /**
     * Method: maximizeControl Set up the labels and divs for the control
     *
     * Parameters: e - {Event}
     */
    maximizeControl : function(e) {

        // set the div's width and height to empty values, so
        // the div dimensions can be controlled by CSS
        this.div.style.width = "";
        this.div.style.height = "";

        this.showControls(false);

        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: minimizeControl Hide all the contents of the control, shrink the
     * size, add the maximize icon
     *
     * Parameters: e - {Event}
     */
    minimizeControl : function(e) {

        // to minimize the control we set its div's width
        // and height to 0px, we cannot just set "display"
        // to "none" because it would hide the maximize
        // div
        this.div.style.width = "0px";
        this.div.style.height = "0px";

        this.showControls(true);

        if (e != null) {
            OpenLayers.Event.stop(e);
        }
    },

    /**
     * Method: ignoreEvent
     *
     * Parameters: evt - {Event}
     */
    ignoreEvent : function(evt) {
        OpenLayers.Event.stop(evt, true);
    },

    /**
     * Method: mouseDown
     * Register a local 'mouseDown' flag so that we'll know whether or not
     *     to ignore a mouseUp event
     *
     * Parameters:
     * evt - {Event}
     */
    mouseDown : function(evt) {
        this.isMouseDown = true;
    },

    /**
     * Method: mouseUp
     * If the 'isMouseDown' flag has been set, that means that the drag was
     *     started from within the LayerSwitcher control, and thus we can
     *     ignore the mouseup. Otherwise, let the Event continue.
     *
     * Parameters:
     * evt - {Event}
     */
    mouseUp : function(evt) {
        if (this.isMouseDown) {
            this.isMouseDown = false;
        }
    },

    /**
     * Method: showControls
     * Hide/Show all LayerSwitcher controls depending on whether we are
     *     minimized or not
     *
     * Parameters:
     * minimize - {Boolean}
     */
    showControls : function(minimize) {

        this.maximizeDiv.style.display = minimize ? "" : "none";
        this.minimizeDiv.style.display = minimize ? "none" : "";
    },

    //      CLASS_NAME: "Portal.ui.openlayers.MapActionsControl"
    CLASS_NAME : "OpenLayers.Control.LayerSwitcher"
});
