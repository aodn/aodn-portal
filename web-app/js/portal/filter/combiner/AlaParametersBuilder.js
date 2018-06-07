Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.ALAParametersBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildParameters: function() {

        var parameters = this._filtersWithValues().map(function(filter) {

            if (filter.constructor == Portal.filter.DateFilter) {
                return filter.getDateValues();
            }

            if (filter.constructor == Portal.filter.GeometryFilter) {
                return {"wkt" : filter.getWkt()}
            }

            return filter.getCql();
        });

        return this._joinParameters(parameters);
    },

    _joinParameters: function(parts) {

        var returnParameters = {};

        Ext.each(parts, function(item) {
            Ext.apply(returnParameters, item);
        });

        return returnParameters;
    },

    buildParameterString: function() {

        var paramString = "";
        var filters = this.buildParameters();

        if (filters['Q'] == undefined) {
            // Q is an essential parameter for ALA download
            return;
        }

        if (filters['fromDate'] || filters['toDate']) {
            filters = this._createDateTimeParameter(filters);
        }

        for (var key in filters) {
            paramString += "&";
            paramString += key + "=" + encodeURIComponent(filters[key]);
        }

        return paramString;
    },

    _createDateTimeParameter: function(filters) {

        var fromDateString = (filters['fromDate']) ? filters['fromDate'] : "*";
        var toDateString = (filters['toDate']) ? filters['toDate'] : "*";

        filters["fq"] = String.format('occurrence_date:[{0} TO {1}]', fromDateString, toDateString);

        delete filters.fromDate;
        delete filters.toDate;
        return filters;
    }
});