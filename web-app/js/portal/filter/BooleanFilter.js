
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

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

        this.trueButton = new Ext.form.Radio({
            name: this.filter.name,
            boxLabel: "True",
            listeners: {
                scope: this,
                check: this._buttonChecked
            }
        });

        this.falseButton = new Ext.form.Radio({
            name: this.filter.name,
            boxLabel: "False",
            listeners: {
               scope: this,
               check: this._buttonChecked
            }
        });

        this.checkbox = new Ext.form.Checkbox({
             name: this.filter.name,
             value: true,
             listeners: {
                 scope: this,
                 check: this._buttonChecked
             }
         });

         this.add(this.trueButton);
         this.add(this.falseButton);
         //this.add(this.checkbox);
    },

    _buttonChecked: function(button, checked){
        if (button === this.trueButton && checked){
            this.CQL = this.filter.name + " = true";
        }
        else if (button === this.falseButton && checked){
            this.CQL = this.filter.name + " = false";
        }

        this._fireAddEvent();
    },

    handleRemoveFilter: function(){
        this.CQL = "";
        this.trueButton.setValue(false);
        this.falseButton.setValue(false);
    },

    _setExistingFilters: function(){
        this.re = new RegExp(this.filter.name + " = (.*) ?");

        var m = this.re.exec(this.layer.getDownloadFilter());

        if (m != null && m.length == 2) {
            this.CQL = this.filter.name + " = " + m[1];

            if (m[1] === "true"){
                this.trueButton.setValue(true);
                this.falseButton.setValue(false);
            }
            else if (m[1] === "false"){
                this.trueButton.setValue(false);
                this.falseButton.setValue(true);
            }
        }
    }
});
