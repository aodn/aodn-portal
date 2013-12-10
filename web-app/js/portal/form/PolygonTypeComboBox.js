/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.form');

Portal.form.PolygonTypeComboBox = Ext.extend(Ext.form.ComboBox, {

    NONE: { style: "none", label: OpenLayers.i18n('polygonTypeNone') },
    POLYGON: { style: "polygon", label: OpenLayers.i18n('polygonTypePolygon') },
    BOUNDING_BOX: { style: "bounding box", label: OpenLayers.i18n('polygonTypeBoundingBox') },

    VALUE_CHANGED_EVENT: 'Portal.form.PolygonTypeComboBox.valuechanged',

    constructor: function(cfg) {
        var config = Ext.apply({
            store: new Ext.data.JsonStore({
                fields: ['style', 'label'],
                data: [this.BOUNDING_BOX, this.POLYGON, this.NONE]
            }),
            width: 150,
            value: this.BOUNDING_BOX.style,
            valueField: 'style',
            displayField: 'label',
            mode: 'local',
            triggerAction: "all",
            editable: false
        }, cfg);

        Portal.form.PolygonTypeComboBox.superclass.constructor.call(this, config);

        Ext.MsgBus.subscribe(this.VALUE_CHANGED_EVENT, this._updateValue, this);
    },

    setValue: function(value) {
        Portal.form.PolygonTypeComboBox.superclass.setValue.call(this, value);
        if (!this.updating) {
            Ext.MsgBus.publish(this.VALUE_CHANGED_EVENT, { sender: this, value: value });
        }
        delete this.updating;
    },

    _updateValue: function(subject, message) {
        if (this !== message.polygonTypeComboBox) {
            this.updating = true;
            this.setValue(message.value);
        }
    }
});
