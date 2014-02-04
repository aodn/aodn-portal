/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.BooleanFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            layout: 'menu',
            layoutConfig: {
                padding: '5',
                align: 'centre'
            },
            autoDestroy: true
        }, cfg);

        Portal.filter.BooleanFilterPanel.superclass.constructor.call(this, config);
    },
    _createField: function() {
        this.checkbox = new Ext.form.Checkbox({
            name: this.filter.name,
            value: true,
            boxLabel: String.format(OpenLayers.i18n('checkboxDescription'), this._formatBoxLabel()),
            listeners: {
                scope: this,
                check: this._buttonChecked
            }
        });

        this.add(this.checkbox);
    },

    _formatBoxLabel: function() {
        var label = this.filter.label.split('_').join(' ').toLowerCase();
        return label;
    },

    _buttonChecked: function(button, checked) {
        this._fireAddEvent();
    },

    getCQL: function() {
        if (this.checkbox.getValue()) {
            return this.filter.name + " = true";
        }
        else {
            return "";
        }
    },

    handleRemoveFilter: function() {
        this.checkbox.setValue(false);
    },

    _setExistingFilters: function() {
        this.re = new RegExp(this.filter.name + " = (.*?)( |$)");

        var m = this.re.exec(this.layer.getDownloadFilter());

        if (m && m[1] && m[1] === "true") {
            this.checkbox.setValue(true);
        }
    }
});
