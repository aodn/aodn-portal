
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.ComboFilter = Ext.extend(Portal.filter.BaseFilter, {

    constructor: function(cfg) {
		var config = Ext.apply({
			autoDestroy: true
		}, cfg);

    	Portal.filter.ComboFilter.superclass.constructor.call(this, config);
	},

	initComponent: function(cfg){
		Portal.filter.ComboFilter.superclass.initComponent.call(this);
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

		var data = [];

		for(var i = 0; i < this.filter.possibleValues.length; i++){
			data.push([this.filter.possibleValues[i]]);
		}

		this.combo.clearValue();
		this.combo.getStore().loadData(data);
	},

    _createCQL: function(combo, record, index){
    	this.CQL = this.filter.name + " LIKE '%" + record.data.text + "%'";
    },

    _onSelected: function(combo, record, index){
		this._createCQL(combo, record, index);
		this._fireAddEvent();
    },

    handleRemoveFilter: function(){
    	this.CQL = "";
    	this.combo.clearValue();
    },

    _setExistingFilters: function(){
    	this.re = new RegExp(this.filter.name + " LIKE '%(.*)%'");

		if(this.layer.params.CQL_FILTER != undefined){
			var m = this.re.exec(this.layer.params.CQL_FILTER);

			if (m != null && m.length == 2) {
				this.combo.setValue(m[1]);
				this.CQL = this.filter.name + " LIKE '%" + m[1] + "%'";
			}
		}
    }
});
