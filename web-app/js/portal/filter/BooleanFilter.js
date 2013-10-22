/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BooleanFilter = Ext.extend(Portal.filter.BaseFilter, {
    _createField: function(){

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

    _buttonChecked: function(button, checked) {
        this._createCQL();
        this._fireAddEvent();
    },

    _createCQL: function() {
        if (this.checkbox.getValue()) {
            this.CQL = this.filter.name + " = true";
        }
        else {
            this.CQL = "";
        }
    },

    handleRemoveFilter: function() {
        this.CQL = "";
        this.checkBox.setValue(false);
    },

    _setExistingFilters: function() {
        this.re = new RegExp(this.filter.name + " = (.*?)( |$)");

        var m = this.re.exec(this.layer.getDownloadFilter());

        if (m && m[1] && m[1] === "true") {
            this.checkbox.setValue(true);
            this._createCQL();
        }
    }

});
