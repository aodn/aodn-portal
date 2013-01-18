
/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.NumberFilter = Ext.extend(Portal.filter.BaseFilter, {
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
        this.operators = new Ext.form.ComboBox({
            triggerAction: 'all',
            mode: 'local',
            width: 100,
            editable: false,
            fieldLabel: "Number",
            store: new Ext.data.ArrayStore({
                fields: [
                    'op'
                ],
                data: [['greater'], ['less'], ['between']]
            }),
            valueField: 'op',
            displayField: 'op',
            listeners:{
                scope: this,
                select: this._opSelect
            }
        });


        this.fromField = new Ext.form.ComboBox({
            name: "from",
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

        this.toField = new Ext.form.ComboBox({
            name: "to",
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
            hidden: true,
            listeners: {
                scope: this,
                select: this._onSelected
            }
        });

        this.add(this.operators);
        this.add(this.fromField);
        this.add(this.toField);

        var data = [];

        /**
         * Number fields should be stored in the form of min/max/delta, e.g. 1 - 10 is 1/10/1
         */

        var vals = this.filter.possibleValues[0].split("/");
        var min = parseFloat(vals[0]);
        var max = parseFloat(vals[1]);
        var inc = parseFloat(vals[2]);


        for(var i = min; i <= max; i += inc){
            data.push([i]);
        }

        this.fromField.getStore().loadData(data);
        this.toField.getStore().loadData(data);
    },

    _opSelect: function(combo, row, index){
        this.toField.setVisible(this.operators.getValue() != "" && this.operators.getValue() == 'between');
    },

    _onSelected: function(combo, record, index){
        this._createCQL(combo, record, index);
        this._fireAddEvent();
    },

    _createCQL: function(combo, record, index){
        var opString = "";
        console.log(this.operators.getValue());
        if(this.operators.getValue() == "greater"){
            opString = " > ";
        }
        else if(this.operators.getValue() == "less"){
            opString = " < ";
        }
        else{
            opString = " BETWEEN ";
        }


        if(this.operators.getValue() != "" && this.operators.getValue() != 'between'){
            this.CQL = this.filter.name + opString + this.fromField.getValue();
        }
        else{
            this.CQL = this.filter.name + opString + this.fromField.getValue() + " AND " +  this.toField.getValue();
        }

        console.log(this.CQL);

    },

    handleRemoveFilter: function(){
        this.CQL = "";
        this.combo.clearValue();
    },

    _setExistingFilters: function(){

    }
});