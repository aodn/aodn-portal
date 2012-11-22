
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.search.field');

Portal.search.field.MapLayersCheckBox = Ext.extend(Portal.search.field.ValueCheckBox, {
  constructor: function(cfg) {
    var config = Ext.apply({
      fieldLabel: OpenLayers.i18n("mapLayers"),
      name: 'protocol',
      labelSeparator : '',
      checked: true,
      checkedValue: Portal.app.config.metadataLayerProtocols.split("\n").join(' or '),
      uncheckedValue: '',
      boxLabel: OpenLayers.i18n("mapLayersOnlyDesc")
    }, cfg);

    Portal.search.field.MapLayersCheckBox.superclass.constructor.call(this, config);
  },
  
  initComponent: function() { 
    Portal.search.field.MapLayersCheckBox.superclass.initComponent.apply(this, arguments);
    
    this.on('check', this.onCheckChange, this);
    this.on('afterrender', this.onCheckChange, this);
    this.on('destroy', this.onMapLayersDestroy, this);
  },
  
  // When other components are added send them protocol details
  onAddFilter: function() {
    this.fireEvent('protocolChange', this.getValue());
  },
  
  onCheckChange: function() {
    this.fireEvent('protocolChange', this.getValue());
  },
  
  onMapLayersDestroy: function() {
    this.fireEvent('protocolChange', this.uncheckedValue);
  }
  
});

Ext.reg('portal.search.field.maplayers', Portal.search.field.MapLayersCheckBox);
