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
        this.combo = new Ext.form.ComboBox({
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

        var data = [];
        var clearFilter = [OpenLayers.i18n('clearFilterOption')];
        data.push(clearFilter);

        for (var i = 0; i < this.filter.values.length; i++) {
            data.push([this.filter.values[i]]);
        }

        this.combo.clearValue();
        this.combo.getStore().loadData(data);
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
                this.filter.name,
                this._escapeSingleQuotes(this.combo.getValue())
            );
        }

        return undefined;
    },

    getFilterData: function() {

        return {
            name: this.filter.name,
            visualised: this.isVisualised(),
            cql: this.getCQL(),
            humanValue: this._getHumanValue()
        }
    },

    _getHumanValue: function() {
        var componentValue = this._escapeSingleQuotes(this.combo.getValue());
        if (componentValue != "") {
            return this.getFilterNameAsTitleCase() + " like \"" + componentValue + "\""
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
            var val = this.filter.label + "=" + this.combo.getValue();
            trackFiltersUsage('filtersTrackingComboAction', val, this.layer.name);
        }
        this._fireAddEvent();
    },

    handleRemoveFilter: function() {
        this.combo.clearValue();
    },

    _setExistingFilters: function() {
        this.re = new RegExp(this.filter.name + " LIKE '(.*?)'");

        var m = this.re.exec(this.layer.getDownloadFilter());

        if (m != null && m.length == 2) {
            this.combo.setValue(m[1]);
        }
    },

    _escapeSingleQuotes: function(text) {
        return text.replace(/'/g, "''");
    }
});
