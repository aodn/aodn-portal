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

        config.searcher.on('searchstart', function() {
            this.stopWatch.start();
        }, this);

        config.searcher.on('searchcomplete', function() {
            this.stopWatch.stop();
            log.info(String.format('Searched collection: {0}', JSON.stringify({
                'status': 'complete',
                'duration (ms)': this.stopWatch.getElapsedMillis()
            })));
        }, this);

        config.searcher.on('searcherror', function() {
            this.stopWatch.stop();
            log.warn(String.format('Searched collection: {0}', JSON.stringify({
                'status': 'failed',
                'duration (ms)': this.stopWatch.getElapsedMillis()
            })));
        }, this);

        Portal.service.SearchRequestLogger .superclass.constructor.call(this, config)
    }
});
