/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.AodaacAggregator', function() {

    var aggregator;

    beforeEach(function() {
        aggregator = new Portal.data.AodaacAggregator();
    });

    it('supportsSubsettedNetCdf returns true', function() {
        expect(aggregator.supportsSubsettedNetCdf()).toBe(true);
    });

    it('supportsNetCdfUrlList returns false', function() {
        expect(aggregator.supportsNetCdfUrlList()).toBe(false);
    });
});