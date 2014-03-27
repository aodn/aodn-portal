/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.form');

Portal.form.PolygonTypeComboBox = Ext.extend(Ext.form.ComboBox, {

    constructor: function(cfg) {
        var config = Ext.apply({
            store: new Ext.data.JsonStore({
                fields: ['value', 'label'],
                data: OpenLayers.i18n('comboBoxTypeLabels')
            }),
            width: 165,
            valueField: 'value',
            displayField: 'label',
            mode: 'local',
            triggerAction: "all",
            editable: false
        }, cfg);

        Portal.form.PolygonTypeComboBox.superclass.constructor.call(this, config);

        this._bindToMap();
        this._registerCleanUpEvents();
    },

    _bindToMap: function() {
        this.setValue(this.map.getSpatialConstraintType());
        
        this.map.events.on({
            scope: this,
            'spatialconstrainttypechanged': this._updateValue,
            'spatialconstraintadded': this._updateComboValue
        });
    },

    _registerCleanUpEvents: function() {
        this.on('beforedestroy', function(self) {
            self.map.events.unregister('spatialconstrainttypechanged', self, self._updateValue);
            self.map.events.unregister('spatialconstraintadded', self, self._updateComboValue);
        });
    },
    
    setValue: function(value) {
        Portal.form.PolygonTypeComboBox.superclass.setValue.call(this, value);
        if (!this.updating) {
            this.map.setSpatialConstraintStyle(value);
        }
        delete this.updating;
    },

    _updateValue: function(spatialConstraintType) {
        this.updating = true;
        this.setValue(spatialConstraintType);
    },

    _updateComboValue: function() {
        Portal.form.PolygonTypeComboBox.superclass.setValue.call(this, this.map.getSpatialConstraintType());
    }
});
