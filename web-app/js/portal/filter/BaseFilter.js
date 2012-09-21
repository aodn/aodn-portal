Ext.namespace('Portal.filter');

Portal.filter.BaseFilter = Ext.extend(Ext.Panel, {
	constructor: function(cfg) {
		var config = Ext.apply({
		}, cfg);

     	this.CQL = "";
     	this.filter = undefined;
     	this.layer = undefined;

     	Portal.filter.BaseFilter.superclass.constructor.call(this, config);
	},

	initComponent: function(cfg){
		this.addEvents('addFilter');
		Portal.filter.BaseFilter.superclass.initComponent.call(this);
	},

	_createField:function(){

	},

	setLayerAndFilter: function(layer, filter){
		this.filter = filter;
		this.layer = layer;
		this._createField();
	},

	getCQL: function(){
		return this.CQL;
	},

	getFilterName: function(){
		return this.filter.name;
	},

	handleRemoveFilter: function(){
	},

	hasValue: function(){
		return this.CQL != "";
	}
});