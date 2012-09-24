Ext.namespace('Portal.filter');

Portal.filter.BooleanFilter = Ext.extend(Portal.filter.BaseFilter, {
	constructor: function(cfg) {
		var config = Ext.apply({
		}, cfg );

		Portal.filter.BooleanFilter.superclass.constructor.call(this, config);
	},

	initComponent: function(cfg){
		this.CQL = "";
		Portal.filter.BooleanFilter.superclass.initComponent.call(this);
	},

	_createField:function(){

     	this.checkbox = new Ext.form.Checkbox({
        	name: this.filter.name,
        	value: true,
        	listeners: {
        		scope: this,
                check: this._buttonChecked
        	}
     	});

     	this.add(this.checkbox);
	},

	_buttonChecked: function(button, checked){
		this.CQL = this.filter.name + " = " + checked
   		this._fireAddEvent();
	},

	handleRemoveFilter: function(){
		this.CQL = "";
        this.checkbox.reset();
	}
});