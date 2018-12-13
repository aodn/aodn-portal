Ext.namespace('Portal.filter');

Portal.filter.MultiStringFilter = Ext.extend(Portal.filter.Filter, {

    getSupportedGeoserverTypes: function() {
        return ['string'];
    },

    hasValue: function() {
        return (this._getFilterStrings().length > 0);
    },

    getUiComponentClass: function() {
        return Portal.filter.ui.MultiStringFilterPanel;
    },

    getCql: function() {
        return "(" + this._join(this._getFilterStrings(false), " OR ") + ")";
    },

    isVisualised: function() {
        return true;
    },

    getHumanReadableForm: function() {
        return this._join(this._getFilterStrings(true), " OR ");
    },

    _join: function(parts, joiner) {
        return parts.length > 0 ? parts.join(joiner) : null;
    },

    getHumanReadableDescriptor: function(item) {
        return String.format(
            "{0}=<b>'{1}'</b>",
            this.getLabel(),
            this._escapeSingleQuotes(item.text)
        );
    },

    getCqlDescriptor: function(item) {
        return String.format(
            "{0} LIKE '{1}'",
            this.name,
            this._escapeSingleQuotes(item.text)
        );
    },

    _getFilterStrings: function(humanReadable) {
        var cqlSnippets = [];
        var that = this;

        Ext.each(this.getValue(), function(item) {
            if (humanReadable) {
                cqlSnippets.push(that.getHumanReadableDescriptor(item));
            }
            else {
                cqlSnippets.push(that.getCqlDescriptor(item));
            }
        });
        return cqlSnippets;
    },

    _escapeSingleQuotes: function(text) {
        return text.replace(/'/g, "''");
    }
});
