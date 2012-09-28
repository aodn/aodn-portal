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
        this.checkbox.setValue(false);
	},

	_setExistingFilters: function(){
		if(this.layer.params.CQL_FILTER != undefined){

			this.re = new RegExp(this.filter.name + " = (.*) ?");

			if(this.layer.params.CQL_FILTER != undefined){
				var m = this.re.exec(this.layer.params.CQL_FILTER);

				if (m != null && m.length == 2) {
					this.CQL = this.filter.name + " = " + m[1];
					this.checkbox.setValue(m[1] == "true");
				}
			}
		}
	}
});