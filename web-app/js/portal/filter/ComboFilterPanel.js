/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.ComboFilterPanel = Ext.extend(Portal.filter.BaseFilterPanel, {

    constructor: function(cfg) {
        var config = Ext.apply({
            autoDestroy: true
        }, cfg);

        Portal.filter.ComboFilterPanel.superclass.constructor.call(this, config);
    },

    _createField: function() {
        this.add(new Ext.form.Label({
            html: "<label>" + this.filter.getDisplayLabel() + "</label>"
        }));

        this.combo = new Ext.form.ComboBox({
            disabled: true,
            triggerAction: 'all',
            mode: 'local',
            typeAhead: true,
            forceSelection: true,
            validator: this.validateValue,
            width: this.MAX_COMPONENT_WIDTH,
            editable: true,
            store: new Ext.data.ArrayStore({
                fields: [
                    'text'
                ],
                data: []
            }),
            valueField: 'text',
            displayField: 'text',
            listeners: {
                scope: this,
                valid: this._onSelected
            }
        });
        this.add(this.combo);

        this.add(
            new Ext.Spacer({
                cls: 'block',
                height: 5
            })
        );
    },

    getFilterData: function() {

        return {
            name: this.filter.getName(),
            visualised: this.isVisualised(),
            cql: this.getCQL(),
            humanValue: this._getHumanValue()
        }
    },

    handleRemoveFilter: function() {
        this.combo.clearValue();
    },

    needsFilterRange: function() {
        return true;
    },

    validateValue: function(value) {

        if (value != "") {
            var val = this.getRawValue();
            var rec = this.findRecord(this.displayField, val);
            if (!rec) {
                this.markInvalid(true);
                return false;
            }
        }

        return true;
    },

    getCQL: function() {
        if (this.combo.getValue()) {
            return String.format(
                "{0} LIKE '{1}'",
                this.filter.getName(),
                this._escapeSingleQuotes(this.combo.getValue())
            );
        }

        return undefined;
    },

    _getHumanValue: function() {
        var componentValue = this._escapeSingleQuotes(this.combo.getValue());
        if (componentValue != "") {
            return this.filter.getDisplayLabel() + " like \"" + componentValue + "\""
        }
        else {
            return ""
        }
    },

    _onSelected: function() {

        if (this.combo.getValue() == OpenLayers.i18n('clearFilterOption')) {
            this.combo.clearValue();
        }
        else if (this.combo.getValue() != "") {
            var val = this.filter.getDisplayLabel() + "=" + this.combo.getValue();
            trackFiltersUsage('filtersTrackingComboAction', val, this.layer.name);
        }
        this._fireAddEvent();
    },

    setFilterRange: function(range) {
        var data = [];
        var clearFilter = [OpenLayers.i18n('clearFilterOption')];
        data.push(clearFilter);

        for (var i = 0; i < range.length; i++) {
            data.push([range[i]]);
        }

        this.combo.clearValue();
        this.combo.getStore().loadData(data);
        this.combo.enable();
    },

    _escapeSingleQuotes: function(text) {
        return text.replace(/'/g, "''");
    }
});
