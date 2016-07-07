Ext.namespace('Portal.filter');

Portal.filter.FilterUtils = {};

Portal.filter.FilterUtils.hasFilter = function(filters, name) {
    if (filters === undefined) {
        return false;
    }

    var filter = filters.filter(function(filter) {
        return 'name' in filter && filter.name == name;
    })[0];

    return filter && 'hasValue' in filter && filter.hasValue();
};

Portal.filter.FilterUtils.getFilter = function(filters, name) {
    return filters.filter(function(filter) {
        return filter.name == name;
    })[0];
};
