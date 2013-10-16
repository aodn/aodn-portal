/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.TimeComboBox = Ext.extend(Ext.form.ComboBox, {
    constructor: function(cfg) {

        var config = Ext.apply({
            store: new Ext.data.JsonStore({
                autoLoad : false,
                autoDestroy : true,
                fields : ['timeValue', 'displayTime']
            }),
            mode: 'local',
            triggerAction : "all",
            editable : false,
            valueField : 'timeValue',
            displayField : 'displayTime'
        }, cfg);

        Portal.details.TimeComboBox.superclass.constructor.call(this, config);
    }
});
