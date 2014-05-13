/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.BodaacAggregator', function() {

    var aggregator;

    beforeEach(function() {
        aggregator = new Portal.data.BodaacAggregator();
    });

    it('supportsSubsettedNetCdf returns true', function() {
        expect(aggregator.supportsSubsettedNetCdf()).toBe(false);
    });

    it('supportsNetCdfUrlList returns false', function() {
        expect(aggregator.supportsNetCdfUrlList()).toBe(true);
    });
});