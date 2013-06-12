/*
 * Copyright 2013 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */
Ext.namespace('Portal.details');

Portal.details.MomentComboBox = Ext.extend(Ext.form.ComboBox, {
    constructor: function(cfg) {
        
        var config = Ext.apply({
            store: new Ext.data.ArrayStore({
                autoLoad : false,
			    autoDestroy : true,
			    fields : ['momentValue', 'displayTime'],
			    data : []
            }),
            mode: 'local',
			triggerAction : "all",
			editable : false,
			valueField : 'momentValue',
            displayField : 'displayTime'
        }, cfg);

        Portal.details.MomentComboBox.superclass.constructor.call(this, config);
    }
});
