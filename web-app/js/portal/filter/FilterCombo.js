Ext.namespace('Portal.filter');

Portal.filter.FilterCombo = Ext.extend(Portal.filter.BaseFilter, {
	constructor: function(cfg) {
		var config = Ext.apply({
			autoDestroy: true
		}, cfg);

    	Portal.filter.FilterCombo.superclass.constructor.call(this, config);
	},

	initComponent: function(cfg){
		Portal.filter.FilterCombo.superclass.initComponent.call(this);
	},

	_createField: function(){
		this.combo = new Ext.form.ComboBox({
			triggerAction: 'all',
			mode: 'local',
			width: 100,
			editable: false,
			store: new Ext.data.ArrayStore({
			   fields: [
				   'text'
			   ],
			   data : []
			}),
			valueField: 'text',
			displayField: 'text',
			listeners: {
				scope: this,
				select: this._onSelected
			}
		});

		this.add(this.combo);

		this.combo.clearValue();
		var values = this.filter.values.split(",");

		var data = [];
		for(var i = 0; i < values.length; i++){
			data.push([values[i]]);
		}

		this.combo.getStore().loadData(data);
	},

    _createCQL: function(combo, record, index){
    	this.CQL = this.filter.name + " LIKE '%" + record.data.text + "%'";
    },

    _onSelected: function(combo, record, index){
		this._createCQL(combo, record, index);
		this.fireEvent('addFilter', this);
    },

    handleRemoveFilter: function(){
    	this.combo.clearValue();
    }

});