Ext.namespace('Portal.filter');

Portal.filter.Filter = Ext.extend(Ext.util.Observable, {

    constructor: function(cfg) {

        Ext.apply(this, cfg);

        Portal.filter.Filter.superclass.constructor.call(this, cfg);
    },

    setValue: function(value) {

        this.value = value;

        this.fireEvent(Portal.filter.Filter.EVENTS.VALUE_CHANGED);
    },

    getValue: function() {

        return this.value;
    },

    hasValue: function() {

        return !!this.value;
    },

    clearValue: function() {

        this.setValue(null);
    },

    getName: function() {

        return this.name;
    },

    getLabel: function() {

        return this.label;
    },

    isVisualised: function() {

        return this.visualised;
    },

    isPrimary: function() {

        return this.primaryFilter;
    },

    getWmsStartDateName: function() {

        return this.wmsStartDateName;
    },

    getWmsEndDateName: function() {

        return this.wmsEndDateName;
    },

    getSupportedGeoserverTypes: function() {

        throw 'Subclasses must implement the getSupportedGeoserverTypes function';
    },

    getUiComponentClass: function() {

        throw 'Subclasses must implement the getUiComponentClass function';
    },

    getCql: function() {

        throw 'Subclasses must implement the getCql function';
    },

    getHumanReadableForm: function() {

        throw 'Subclasses must implement the getHumanReadableForm function';
    }
});

Portal.filter.Filter.EVENTS = {
    VALUE_CHANGED: 'filterValueChanged'
};

Portal.filter.Filter.classFor = function(filterConfig) {

    var filterConstructors = [
        Portal.filter.BooleanFilter,
        Portal.filter.DateFilter,
        Portal.filter.GeometryFilter,
        Portal.filter.NumberFilter,
        Portal.filter.MultiStringFilter,
        Portal.filter.AlaSpeciesStringArrayFilter,
        Portal.filter.StringDepthFilter
    ];

    var filterType = filterConfig.type;
    var matchingConstructor;

    Ext.each(filterConstructors, function(currentConstructor) {

        var supportedTypes = currentConstructor.prototype.getSupportedGeoserverTypes();

        if (supportedTypes.indexOf(filterType) > -1) {

            matchingConstructor = currentConstructor;

            return false;
        }
    });

    return matchingConstructor;
};
