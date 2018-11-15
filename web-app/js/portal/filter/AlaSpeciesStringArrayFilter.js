Ext.namespace('Portal.filter');

Portal.filter.AlaSpeciesStringArrayFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {
        return ['alastringarray'];
    },

    hasValue: function() {
        return (this._getFilterStrings().length > 0);
    },

    getUiComponentClass: function() {
        return Portal.filter.ui.AlaSpeciesFilterPanel;
    },

    getFormattedFilterValue: function() {
        var filterString = this._join(this._getFilterStrings(), " OR ");
        return {"q": filterString}
    },

    getCql: function() {},

    isVisualised: function() {
        return true;
    },

    getHumanReadableForm: function() {
        return String.format(
            '{0}: {1}',
            this.getLabel(),
            this._join(this._getFilterStrings(true), " OR ")
        );
    },

    _getFilterValueString: function(filterData) {
        return (filterData.guid.startsWith("urn")) ? "lsid:" + filterData.guid : "text:" + filterData.name.replace(/[^a-z0-9+]+/gi, '+');
    },

    _join: function(parts, joiner) {
        return parts.length > 0 ? parts.join(joiner) : null;
    },

    getHumanReadableDescriptor: function(item) {
        var commonName = (item.commonNameSingle) ? String.format("'{0}'", item.commonNameSingle) : "";
        return String.format("{0} - {1} {2}", Ext.util.Format.capitalize(item.rawRank), item.name, commonName);
    },

    _getFilterStrings: function(humanReadable) {
        var returnParameters = [];
        var that = this;

        Ext.each(this.getValue(), function(item) {
            if (humanReadable) {
                returnParameters.push(that.getHumanReadableDescriptor(item));
            }
            else {
                returnParameters.push(that._getFilterValueString(item))
            }
        });

        return returnParameters;
    }
});
