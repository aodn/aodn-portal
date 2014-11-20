/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

Ext.namespace('Portal.service');

Portal.service.SearchRequestLogger = Ext.extend(Ext.util.Observable, {

    constructor: function(config) {

        this.stopWatch = new Portal.utils.StopWatch();

        this.searcher = config.searcher;

        this.searcher.on('searchstart', function() {
            this.stopWatch.start();
            this._logSearchStart();
        }, this);

        this.searcher.on('searchcomplete', function() {
            this.stopWatch.stop();
            log.info(String.format('Searched collection: {0}', JSON.stringify({
                'status': 'success',
                'duration (ms)': this.stopWatch.getElapsedMillis()
            })));
        }, this);

        this.searcher.on('searcherror', function() {
            this.stopWatch.stop();
            log.warn(String.format('Searched collection: {0}', JSON.stringify({
                'status': 'failed',
                'duration (ms)': this.stopWatch.getElapsedMillis()
            })));
        }, this);

        Portal.service.SearchRequestLogger.superclass.constructor.call(this, config)
    },

    _logSearchStart: function() {
        // Format search filters
        var facets = [];

        this.searcher.searchFilters.each(function(rec) {
            facets.push(rec.get('value'));
        });

        if (facets.length > 0) {
            var deepestFacets = this.searcher.getDeepestFacets(facets);

            log.info(
                "Searching collections: " + JSON.stringify({
                    'facets': deepestFacets
                })
            );
        }
    }
});
