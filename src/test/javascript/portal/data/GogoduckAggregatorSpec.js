/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.GogoduckAggregator', function() {

    var aggregator;

    beforeEach(function() {
        aggregator = new Portal.data.GogoduckAggregator();
    });

    it('supportsSubsettedNetCdf returns true', function() {
        expect(aggregator.supportsSubsettedNetCdf()).toBe(true);
    });

    it('supportsNetCdfUrlList returns false', function() {
        expect(aggregator.supportsNetCdfUrlList()).toBe(false);
    });
});