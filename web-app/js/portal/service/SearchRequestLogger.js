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
            this._logSearchStart();
        }, this);

        this.searcher.on('searchcomplete', function() {
            this._logElapsedTime('info', 'success');
        }, this);

        this.searcher.on('searcherror', function() {
            this._logElapsedTime('warn', 'failed');
        }, this);

        Portal.service.SearchRequestLogger.superclass.constructor.call(this, config)
    },

    _logElapsedTime: function(logLevel, status) {
        this.stopWatch.stop();
        log[logLevel](String.format('Searched collections: {0}', JSON.stringify({
            'status': status,
            'duration (ms)': this.stopWatch.getElapsedMillis()
        })));
    },

    _logSearchStart: function() {
        this.stopWatch.start();

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
