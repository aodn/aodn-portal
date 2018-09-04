Ext.namespace('Portal.filter.combiner');

Portal.filter.combiner.AlaParametersBuilder = Ext.extend(Portal.filter.combiner.BaseFilterCombiner, {

    buildParameters: function(filters) {

        var parameters = filters.map(function(filter) {

            if (filter.constructor == Portal.filter.DateFilter) {
                return filter.getDateValues();
            }

            if (filter.constructor == Portal.filter.GeometryFilter) {
                return {"wkt" : filter.getWkt()}
            }

            if (filter.constructor == Portal.filter.AlaSpeciesStringArrayFilter) {
                return filter.getFormattedFilterValue();
            }

            return filter.getCql();
        });

        return this.applyFqIndex(this._joinParameters(parameters));
    },

    _joinParameters: function(parts) {

        var returnParameters = {};

        Ext.each(parts, function(item) {
            Ext.apply(returnParameters, item);
        });

        return returnParameters;
    },

    getExpandedParameters: function(visualised) {

        var filters;

        // filters visualised in map only
        if (visualised === true) {
            filters = this.buildParameters(this._visualisedFiltersWithValues());
        }
        else {
            filters = this.buildParameters(this._filtersWithValues());
        }

        return this.expandDateTimeParameters(filters);
    },

    buildParameterString: function() {

        var paramString = "";
        var filters = this.getExpandedParameters();

        for (var key in filters) {
            paramString += "&";
            paramString += key + "=" + encodeURIComponent(filters[key]);
        }

        return paramString;
    },

    applyFqIndex: function(params) {

        if (Portal.app.appConfig.ala.index != undefined) {
            params['fq'] = Portal.app.appConfig.ala.index;
        }
        return params;
    },

    expandDateTimeParameters: function(filters) {
        if (filters['fromDate'] || filters['toDate']) {

            var fromDateString = (filters['fromDate']) ? filters['fromDate'] : "*";
            var toDateString = (filters['toDate']) ? filters['toDate'] : "*";

            var fqVal = (filters["fq"] != undefined) ? filters["fq"] + " " : "";
            filters["fq"] =  String.format('{2}occurrence_date:[{0} TO {1}]', fromDateString, toDateString, fqVal);

            delete filters.fromDate;
            delete filters.toDate;
        }

        return filters;
    }
});
