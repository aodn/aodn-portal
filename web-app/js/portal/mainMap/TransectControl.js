
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.mainMap');

Portal.mainMap.TransectControl = Ext.extend(Ext.Container, {
  layer: null,  // layer to perform transect on
  mapPanel: null,  // mapPanel containing map
  layout: 'hbox',
  hidden: true,

  initComponent: function() {
    this.items = [{
      xtype: 'label',
      text: OpenLayers.i18n("turnOnTransect"),
      margins: {right: 15, top: 4, left:0, bottom:0}
    },{
      xtype: 'button',
      iconCls: 'p-btn-transect',
      scope: this,
      handler: this.toggleDraw
    }];

    Portal.mainMap.TransectControl.superclass.initComponent.apply(this, arguments);

    this.addEvents('transect');
  },

  setMapPanel: function(mapPanel) {
    if (this.mapPanel == mapPanel)
      return;

    this.mapPanel = mapPanel;

    // create layer and control for drawing transects
    this.drawingLayer = new OpenLayers.Layer.Vector( OpenLayers.i18n("drawing"));
    this.drawingControl = new OpenLayers.Control.DrawFeature(this.drawingLayer, OpenLayers.Handler.Path, {title: OpenLayers.i18n('drawingTitle')});

    this.mapPanel.map.addControl(this.drawingControl);

    this.drawingLayer.events.register('featureadded', this, this.onAddFeature);
    this.drawingLayer.events.fallThrough = false;
  },

  toggleDraw: function() {
    if (this.drawingControl.active) {
      this.drawingControl.deactivate();
    } else {
      this.drawingControl.activate();
    }
  },

  deactivateDrawingControl: function() {
      if (this.drawingControl != null) {
          this.drawingControl.deactivate();
      }
  },

  onAddFeature: function(e) {
    var label = this.layer.name,
        layerName = this.layer.params['LAYERS'],
        serverUrl = this.escapeProxy(this.layer.server.uri),
        dimensionValues = {},
        dimensionParams = '';

    // Destroy previously-added line string
    if (this.drawingLayer.features.length > 1) {
        this.drawingLayer.destroyFeatures(this.drawingLayer.features[0]);
    }
    // Get the linestring specification
    var line = e.feature.geometry.toString();
    // we strip off the "LINESTRING(" and the trailing ")"
    line = line.substring(11, line.length - 1);

    //HACK: Pass time parameter if specified for layer
    //TODO: replace this with loop on dimensions when this info is available from GetCapabilities statement
    if (this.layer.params.TIME != undefined) {
      dimensionValues.TIME =  this.layer.params.TIME;
      dimensionParams = '&TIME=' + dimensionValues.TIME;
    }

    // Load an image of the transect
    var transectUrl =   serverUrl +
        'REQUEST=GetTransect' +
        '&LAYER=' + encodeURIComponent(layerName) +
        '&CRS=' + this.mapPanel.map.baseLayer.projection.toString() +
        dimensionParams +
        '&LINESTRING=' + encodeURIComponent(line) +
        '&FORMAT=image/png';

    var inf = new Object();
    inf.transectUrl = transectUrl;
    inf.line = dressUpMyLine(line);
    inf.label = label;
    inf.dimensionValues = this.format(dimensionValues);
    inf.layerName = layerName;

    this.fireEvent('transect', inf);

    this.drawingControl.deactivate();

    // place click handler back fudge
    //zoom.activate();
    //zoom.deactivate();
    //clickEventHandler.deactivate();
    //clickEventHandler.activate();
    //pan.activate();
  },

  format: function(dimensionValues) {
    var result = '';

    Ext.iterate(dimensionValues, function(key, value) {
      result += key + ': ' + value + '<BR>';
    });

    return result;
  },

  escapeProxy: function(serverUrl) {
    // the serverUrl may be a relative path to our proxy cache
    if (serverUrl.substring(0, 1) == "/") {
        // these urls 'will' should have a trailing question mark needing encoding
        if (serverUrl.substring(serverUrl.length - 1, serverUrl.length) == "?") {
            // encode just trailing uqestion mark
             return serverUrl.substring(0,serverUrl.length - 1) + "%3F";
        } else {
          return serverUrl;
        }
    }
    else {
        return serverUrl +"?";
    }
  }
});

