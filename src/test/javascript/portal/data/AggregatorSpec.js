/*
 * Copyright 2014 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

describe('Portal.data.Aggregator', function() {

    var aggregator;

    beforeEach(function() {
        aggregator = new Portal.data.Aggregator();
    });

    it('supportsSubsettedNetCdf returns false by default', function() {
        expect(aggregator.supportsSubsettedNetCdf()).toBe(false);
    });

    it('supportsNetCdfUrlList returns false by default', function() {
        expect(aggregator.supportsNetCdfUrlList()).toBe(false);
    });
});