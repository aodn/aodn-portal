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
            width: 165,
            editable: false,
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
                select: this._onSelected
            }
        });

        this.add(this.combo);

        var data = [];
        var clearFilter = [OpenLayers.i18n('clearFilterOption')];
        data.push(clearFilter);

        for (var i = 0; i < this.filter.possibleValues.length; i++) {
            data.push([this.filter.possibleValues[i]]);
        }

        this.combo.clearValue();
        this.combo.getStore().loadData(data);
    },

    getCQL: function() {
        if (this.combo.getValue()) {
            return String.format(
                "{0} LIKE '{1}'",
                this.filter.name,
                this._escapeSingleQuotes(this.combo.getValue())
            );
        }

        return '';
    },

    _onSelected: function(combo, record, index) {
        if(this.combo.getValue() == OpenLayers.i18n('clearFilterOption')) {
            this.combo.clearValue();
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
