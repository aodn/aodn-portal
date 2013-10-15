
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BooleanFilter = Ext.extend(Portal.filter.BaseFilter, {
    _createField:function() {

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

    _buttonChecked: function(button, checked) {
        this._createCQL();
        this._fireAddEvent();
    },

    _createCQL: function() {
        if (this.trueButton.getValue()) {
            this.CQL = this.filter.name + " = true";
        }
        else if (this.falseButton.getValue()) {
            this.CQL = this.filter.name + " = false";
        }
    },
    
    handleRemoveFilter: function() {
        this.CQL = "";
        this.trueButton.setValue(false);
        this.falseButton.setValue(false);
    },

    _setExistingFilters: function() {
        this.re = new RegExp(this.filter.name + " = (.*?)( |$)");

        var m = this.re.exec(this.layer.getDownloadFilter());

        if (m != null && m.length == 3) {
            if (m[1] === "true") {
                this.trueButton.setValue(true);
                this.falseButton.setValue(false);
                this._createCQL();
            }
            else if (m[1] === "false") {
                this.trueButton.setValue(false);
                this.falseButton.setValue(true);
                this._createCQL();
            }
        }
    }
});
