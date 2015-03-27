/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter.ui');

Portal.filter.ui.BooleanFilterPanel = Ext.extend(Portal.filter.ui.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            typeLabel: OpenLayers.i18n('generalFilterHeading'),
            layout: 'menu',
            layoutConfig: {
                align: 'centre'
            },
            autoDestroy: true
        }, cfg);

        Portal.filter.ui.BooleanFilterPanel.superclass.constructor.call(this, config);
    },

    _createControls: function() {
        this.checkbox = new Ext.form.Checkbox({
            name: this.filter.getName(),
            value: true,
            labelStyle: "inheritFont",
            boxLabel: this._formatBoxLabel(),
            listeners: {
                scope: this,
                check: this._buttonChecked
            }
        });

        this.add(this.checkbox);
    },

    handleRemoveFilter: function() {
        this.checkbox.setValue(false);

        this.filter.clearValue();
    },

    needsFilterRange: function() {
        return false;
    },

    _formatBoxLabel: function() {
        return this.filter.getLabel();
    },

    _buttonChecked: function() {
        this.filter.setValue(this.checkbox.getValue());

        this._fireAddEvent();

        var val = this.filter.getLabel() + "=" + this.checkbox.getValue();
        trackFiltersUsage('filtersTrackingBooleanAction', val, this.layer.name);
    }
});
