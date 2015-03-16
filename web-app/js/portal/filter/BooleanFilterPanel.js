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
            typeLabel: OpenLayers.i18n('generalFilterHeading'),
            layout: 'menu',
            layoutConfig: {
                align: 'centre'
            },
            autoDestroy: true
        }, cfg);

        Portal.filter.BooleanFilterPanel.superclass.constructor.call(this, config);
    },

    _createField: function() {
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

    getFilterData: function() {

        return {
            name: this.filter.getName(),
            visualised: this.isVisualised(),
            cql: this.getCQL(),
            humanValue: this._getCQLHumanValue()
        }
    },

    handleRemoveFilter: function() {
        this.checkbox.setValue(false);
    },

    needsFilterRange: function() {
        return false;
    },

    _formatBoxLabel: function() {
        return this.filter.getDisplayLabel();
    },

    _buttonChecked: function() {
        this._fireAddEvent();

        var val = this.filter.getDisplayLabel() + "=" + this.checkbox.getValue();
        trackFiltersUsage('filtersTrackingBooleanAction', val, this.layer.name);
    },

    getCQL: function() {
        if (this.checkbox.getValue()) {
            return this.filter.getName() + " = true";
        }
        else {
            return undefined;
        }
    },

    _getCQLHumanValue: function() {
        if (this.checkbox.getValue()) {
            return this.filter.getDisplayLabel() + " = true";
        }
        else {
            return undefined;
        }
    }
});
