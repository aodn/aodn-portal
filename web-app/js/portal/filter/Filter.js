/*
 * Copyright 2015 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.filter');

Portal.filter.Filter = Ext.extend(Object, {

    constructor: function(filterDetail) {

        this.name = filterDetail.name;
        this.displayLabel = filterDetail.label;
        this.type = filterDetail.type;
        this.visualised = filterDetail.visualised;
        this.wmsStartDateName = filterDetail.wmsStartDateName;
        this.wmsEndDateName = filterDetail.wmsEndDateName;
    },

    setValue: function(value) {

        this.value = value;
    },

    getValue: function() {

        return this.value;
    },

    getName: function() {

        return this.name;
    },

    getDisplayLabel: function() {

        return this.displayLabel;
    },

    getType: function() {

        return this.type;
    },

    getVisualised: function() {

        return this.visualised;
    },

    getWmsStartDateName: function() {

        return this.wmsStartDateName;
    },

    getWmsEndDateName: function() {

        return this.wmsEndDateName;
    }
});
