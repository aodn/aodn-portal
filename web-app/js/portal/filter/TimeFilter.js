Ext.namespace('Portal.filter');

Portal.filter.TimeFilter = Ext.extend(Portal.filter.BaseFilter, {
	constructor: function(cfg) {
		var config = Ext.apply({
		}, cfg );

		this.TIME_UTIL = new Portal.utils.TimeUtil();
		Portal.filter.TimeFilter.superclass.constructor.call(this, config);
	},

	initComponent: function(cfg){
		this.CQL = "";
		Portal.filter.TimeFilter.superclass.initComponent.call(this);
	},

	_createField: function(){
		this.operators = new Ext.form.ComboBox({
			triggerAction: 'all',
			mode: 'local',
			width: 100,
			editable: false,
			fieldLabel: "Time",
			store: new Ext.data.ArrayStore({
			fields: [
				'op'
			],
			data: [['before'], ['after'], ['between']]
			}),
			valueField: 'op',
			displayField: 'op',
			listeners:{
				scope: this,
				select: this._opSelect
			}
		});

		this.fromField = new Ext.form.DateField({
			name: 'from',
			listeners: {
				scope: this,
				select: this._onSelect
			}
		});

		this.toField = new Ext.form.DateField({
			name: 'to',
			hidden: true,
			listeners: {
				scope: this,
				select: this._onSelect
			}
		});

		this.add(this.operators);
		this.add(this.fromField);
		this.add(this.toField);

		if(this.filter.filterValues != undefined){
			var vals = this.filter.filterValues.split(",");
			this._setMinMax(this.fromField, vals);
			this._setMinMax(this.toField, vals);
		}
	},

	_setMinMax: function(dateField, vals){
		dateField.setMinValue(this.TIME_UTIL._parseIso8601Date(vals[0]));
		if(vals.length == 2){
			dateField.setMaxValue(this.TIME_UTIL._parseIso8601Date(vals[1]));
		}
	},

	_opSelect: function(combo, row, index){
		this.toField.setVisible(this.operators.getValue() != "" && this.operators.getValue() == 'between');
	},

    _getDateString: function(combo){
      	return this.TIME_UTIL._toUtcIso8601DateString(combo.getValue());
    },

	_onSelect: function(picker, date){
		if(this.operators.getValue() != 'between'){
			this.CQL = this.filter.name + " ";
			this.CQL += this.operators.getValue() + " " + this._getDateString(this.fromField);
            this._fireAddEvent();
		}
		else{
			if(this.fromField.getValue() != "" && this.toField.getValue() != "")
			{
				this.CQL = this.filter.name + " ";
				this.CQL += "after " + this._getDateString(this.fromField) + " AND " + this.filter.name + " before " + this._getDateString(this.toField);
				this._fireAddEvent();
			}
		}
	},

	handleRemoveFilter: function(){
		this.operators.clearValue();
	}

});